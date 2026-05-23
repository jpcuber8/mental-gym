import { NextResponse } from "next/server";
import type { MentalGymData } from "@/types/mental-gym";

const redisKey = "mental-gym:v1:data";

type RedisResponse<T> = {
  result?: T;
  error?: string;
};

export async function GET(request: Request) {
  const auth = authorize(request);

  if (auth) {
    return auth;
  }

  try {
    const data = await redisCommand<string | null>(["GET", redisKey]);

    return NextResponse.json({
      data: data ? JSON.parse(data) : null
    });
  } catch {
    return NextResponse.json({ error: "Unable to load cloud sync data." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = authorize(request);

  if (auth) {
    return auth;
  }

  try {
    const data = (await request.json()) as MentalGymData;
    await redisCommand(["SET", redisKey, JSON.stringify(data)]);

    return NextResponse.json({
      ok: true,
      savedAt: new Date().toISOString()
    });
  } catch {
    return NextResponse.json({ error: "Unable to save cloud sync data." }, { status: 500 });
  }
}

function authorize(request: Request) {
  const expected = process.env.MENTAL_GYM_SYNC_SECRET;
  const provided = request.headers.get("x-mental-gym-sync-secret");

  if (!expected) {
    return NextResponse.json({ error: "Cloud sync is not configured." }, { status: 503 });
  }

  if (!provided || provided !== expected) {
    return NextResponse.json({ error: "Invalid sync passcode." }, { status: 401 });
  }

  return null;
}

async function redisCommand<T>(command: unknown[]) {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL ??
    process.env.STORAGE_KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN ??
    process.env.STORAGE_KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("Upstash Redis env vars are missing.");
  }

  const response = await fetch(url, {
    body: JSON.stringify(command),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("Redis command failed.");
  }

  const payload = (await response.json()) as RedisResponse<T>;

  if (payload.error) {
    throw new Error(payload.error);
  }

  return payload.result as T;
}
