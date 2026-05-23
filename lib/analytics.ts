import { dateKey, toDate } from "@/lib/season";
import type { MentalGymData, SessionRecord, StationId } from "@/types/mental-gym";

export function getWeekStart(date = new Date()) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  return toDate(dateKey(start));
}

export function getSessionsThisWeek(data: MentalGymData, date = new Date()) {
  const weekStart = getWeekStart(date);

  return data.sessions.filter((session) => toDate(session.date) >= weekStart);
}

export function getAdherence(data: MentalGymData, frequencyGoal: number, date = new Date()) {
  const completed = getSessionsThisWeek(data, date).length;
  return {
    completed,
    goal: frequencyGoal,
    rate: frequencyGoal === 0 ? 0 : completed / frequencyGoal
  };
}

export function average(values: number[]) {
  if (!values.length) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getRecentSessions(data: MentalGymData, count = 5) {
  return data.sessions.slice(0, count);
}

export function getMetricTrend(data: MentalGymData, metric: keyof SessionRecord["readiness"], count = 7) {
  return data.sessions
    .slice(0, count)
    .reverse()
    .map((session) => Number(session.readiness[metric]));
}

export function getLatestAverages(data: MentalGymData) {
  const recent = getRecentSessions(data, 5);

  return {
    stress: average(recent.map((session) => session.readiness.stress)),
    focus: average(recent.map((session) => session.readiness.focus)),
    confidence: average(recent.map((session) => session.readiness.confidence)),
    freshness: average(recent.map((session) => session.readiness.freshness)),
    usefulness: average(recent.map((session) => session.reflection.usefulness)),
    execution: average(recent.map((session) => session.reflection.execution))
  };
}

export function hasHighStressStreak(data: MentalGymData) {
  const recent = getRecentSessions(data, 3);
  return recent.length >= 3 && recent.every((session) => session.readiness.stress >= 8);
}

export function hasLowFocus(data: MentalGymData) {
  const recent = getRecentSessions(data, 3);
  return recent.length >= 2 && average(recent.map((session) => session.readiness.focus))! <= 4;
}

export function hasLowConfidenceModerateStress(data: MentalGymData) {
  const recent = getRecentSessions(data, 3);

  if (recent.length < 2) {
    return false;
  }

  const confidence = average(recent.map((session) => session.readiness.confidence));
  const stress = average(recent.map((session) => session.readiness.stress));
  return confidence !== null && stress !== null && confidence <= 4 && stress >= 4 && stress <= 7;
}

export function hasPoorRecentStation(data: MentalGymData, stationId: StationId) {
  const recent = data.sessions.filter((session) => session.stationId === stationId).slice(0, 2);
  return recent.length >= 2 && recent.every((session) => session.reflection.usefulness <= 4 || session.reflection.execution <= 4);
}

export function getStationCompletions(data: MentalGymData, stationId: StationId) {
  return data.sessions.filter((session) => session.stationId === stationId).length;
}
