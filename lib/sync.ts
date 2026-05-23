"use client";

import type { MentalGymData, SessionRecord, StationId } from "@/types/mental-gym";

const syncSecretKey = "mental-gym-sync-secret";

export function loadSyncSecret() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(syncSecretKey) ?? "";
}

export function saveSyncSecret(secret: string) {
  if (typeof window === "undefined") {
    return;
  }

  if (secret.trim()) {
    window.localStorage.setItem(syncSecretKey, secret.trim());
    return;
  }

  window.localStorage.removeItem(syncSecretKey);
}

export async function pullCloudData(secret: string) {
  const response = await fetch("/api/sync", {
    headers: {
      "x-mental-gym-sync-secret": secret
    }
  });

  const payload = (await response.json()) as { data?: MentalGymData | null; error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Cloud pull failed.");
  }

  return payload.data ?? null;
}

export async function pushCloudData(secret: string, data: MentalGymData) {
  const response = await fetch("/api/sync", {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "x-mental-gym-sync-secret": secret
    },
    method: "PUT"
  });

  const payload = (await response.json()) as { error?: string; savedAt?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Cloud push failed.");
  }

  return payload.savedAt ?? new Date().toISOString();
}

export function mergeMentalGymData(local: MentalGymData, cloud: MentalGymData): MentalGymData {
  const sessions = mergeSessions(local.sessions, cloud.sessions);
  const customCues = Array.from(new Set([...local.customCues, ...cloud.customCues])).slice(0, 24);
  const stationIds = Array.from(
    new Set([...Object.keys(local.skillProgress), ...Object.keys(cloud.skillProgress)])
  ) as StationId[];

  return {
    ...local,
    sessions,
    customCues,
    skillProgress: Object.fromEntries(
      stationIds.map((stationId) => {
        const localProgress = local.skillProgress[stationId] ?? { level: 1, successStreak: 0 };
        const cloudProgress = cloud.skillProgress[stationId] ?? { level: 1, successStreak: 0 };

        return [
          stationId,
          {
            level: Math.max(localProgress.level, cloudProgress.level),
            successStreak: Math.max(localProgress.successStreak, cloudProgress.successStreak)
          }
        ];
      })
    ) as MentalGymData["skillProgress"],
    settings: {
      ...cloud.settings,
      ...local.settings
    }
  };
}

function mergeSessions(local: SessionRecord[], cloud: SessionRecord[]) {
  const byId = new Map<string, SessionRecord>();

  for (const session of [...cloud, ...local]) {
    byId.set(session.id, session);
  }

  return Array.from(byId.values())
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 365);
}
