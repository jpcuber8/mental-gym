"use client";

import type { MentalGymData, SessionRecord, StationId } from "@/types/mental-gym";

const storageKey = "mental-gym-data-v1";

const stationIds: StationId[] = [
  "breathing",
  "attention",
  "selfTalk",
  "imagery",
  "processGoals",
  "routine",
  "reset"
];

export function createDefaultData(): MentalGymData {
  return {
    version: 1,
    settings: {
      name: "Joshua",
      reducedMotion: false
    },
    sessions: [],
    customCues: [],
    skillProgress: Object.fromEntries(
      stationIds.map((stationId) => [stationId, { level: 1, successStreak: 0 }])
    ) as MentalGymData["skillProgress"]
  };
}

export function loadMentalGymData(): MentalGymData {
  if (typeof window === "undefined") {
    return createDefaultData();
  }

  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return createDefaultData();
  }

  try {
    return normalizeData(JSON.parse(raw));
  } catch {
    return createDefaultData();
  }
}

export function saveMentalGymData(data: MentalGymData) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(data));
}

export function resetMentalGymData() {
  if (typeof window === "undefined") {
    return createDefaultData();
  }

  const fresh = createDefaultData();
  window.localStorage.setItem(storageKey, JSON.stringify(fresh));
  return fresh;
}

export function exportMentalGymData(data: MentalGymData) {
  return JSON.stringify(data, null, 2);
}

export function importMentalGymData(raw: string): MentalGymData {
  return normalizeData(JSON.parse(raw));
}

export function addCompletedSession(data: MentalGymData, session: SessionRecord): MentalGymData {
  const progress = data.skillProgress[session.stationId] ?? { level: 1, successStreak: 0 };
  const wasUseful = session.reflection.usefulness >= 7 && session.reflection.execution >= 7;
  const wasPoor = session.reflection.usefulness <= 4 || session.reflection.execution <= 4;
  const successStreak = wasUseful ? progress.successStreak + 1 : wasPoor ? 0 : progress.successStreak;
  const level = successStreak >= 3 ? Math.min(4, progress.level + 1) : progress.level;

  return {
    ...data,
    sessions: [session, ...data.sessions].slice(0, 365),
    customCues: session.reflection.carryoverCue
      ? Array.from(new Set([session.reflection.carryoverCue, ...data.customCues])).slice(0, 24)
      : data.customCues,
    skillProgress: {
      ...data.skillProgress,
      [session.stationId]: {
        level,
        successStreak: successStreak >= 3 ? 0 : successStreak
      }
    }
  };
}

function normalizeData(value: unknown): MentalGymData {
  const fallback = createDefaultData();
  const data = typeof value === "object" && value !== null ? (value as Partial<MentalGymData>) : fallback;

  return {
    version: 1,
    settings: {
      ...fallback.settings,
      ...(data.settings ?? {})
    },
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
    customCues: Array.isArray(data.customCues) ? data.customCues : [],
    skillProgress: {
      ...fallback.skillProgress,
      ...(data.skillProgress ?? {})
    }
  };
}
