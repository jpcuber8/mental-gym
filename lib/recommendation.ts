import {
  getAdherence,
  hasHighStressStreak,
  hasLowConfidenceModerateStress,
  hasLowFocus,
  hasPoorRecentStation
} from "@/lib/analytics";
import { getCurrentPhase, getNextEvent, getNextRace, daysUntilEvent, isPeakPhase, isRaceWithin } from "@/lib/season";
import { getStation, scriptPresets } from "@/lib/stations";
import type { MentalGymData, SessionMode, SessionPlan, StationId } from "@/types/mental-gym";

const rotation: StationId[] = ["breathing", "attention", "selfTalk", "imagery", "processGoals", "reset"];

export function getRecommendation(data: MentalGymData, date = new Date(), manualStation?: StationId): SessionPlan {
  const phase = getCurrentPhase(date);
  const nextEvent = getNextEvent(date);
  const nextRace = getNextRace(date);
  const raceDays = daysUntilEvent(nextRace, date);
  const adherence = getAdherence(data, phase.frequencyGoal, date);
  const dayIndex = Math.max(0, Math.floor(date.getTime() / (24 * 60 * 60 * 1000))) % rotation.length;

  let presetKey = "baseFocus";
  let stationId: StationId = rotation[dayIndex];
  let mode: SessionMode = manualStation ? "manual" : "daily";
  const whyToday: string[] = [`Current phase: ${phase.title}.`];

  if (manualStation) {
    stationId = manualStation;
    presetKey = presetForStation(manualStation);
    whyToday.push("Manual station start from the library.");
  } else if (isRaceWithin(date, 24)) {
    presetKey = "raceDay";
    stationId = "routine";
    mode = "raceDay";
    whyToday.push("Race is within 24 hours, so the app removes novelty and keeps the session short.");
  } else if (adherence.rate < 0.4 && data.sessions.length >= 2) {
    presetKey = "maintenance";
    stationId = "breathing";
    mode = "maintenance";
    whyToday.push("Weekly adherence is low, so the recommendation shrinks to a 3-minute maintenance rep.");
  } else if (hasHighStressStreak(data)) {
    presetKey = "travelReset";
    stationId = "breathing";
    whyToday.push("Stress has been high across three recent sessions, so regulation gets priority.");
  } else if (phase.id === "london") {
    presetKey = "travelReset";
    stationId = "breathing";
    whyToday.push("Travel phase is active: short, forgiving, and sleep-friendly.");
  } else if (phase.id === "transition") {
    presetKey = "transitionGrounding";
    stationId = "processGoals";
    whyToday.push("Late July through mid-August is a special transition-support window.");
  } else if (phase.id === "bigBear") {
    presetKey = "altitudePatience";
    stationId = "processGoals";
    whyToday.push("Big Bear phase prioritizes patience, adaptation, and group-environment composure.");
  } else if (phase.id === "tuneup" || phase.id === "nuttycombe" || phase.id === "bigTens" || phase.id === "westRegional") {
    presetKey = raceDays === 0 ? "raceDay" : raceDays !== null && raceDays <= 2 ? "meetEve" : "championshipConfidence";
    stationId = presetKey === "championshipConfidence" ? "imagery" : "routine";
    mode = raceDays === 0 ? "raceDay" : "daily";
    whyToday.push("Key race proximity reduces novelty and emphasizes imagery, confidence recall, and routine.");
  } else if (hasLowConfidenceModerateStress(data)) {
    presetKey = "championshipConfidence";
    stationId = "imagery";
    whyToday.push("Recent confidence is low while stress is workable, so imagery plus confidence recall is prescribed.");
  } else if (hasLowFocus(data)) {
    presetKey = "baseFocus";
    stationId = "attention";
    whyToday.push("Recent focus is low, so the session trains anchors and flexible focus shifting.");
  } else if (nextEvent?.type === "travel" && daysUntilEvent(nextEvent, date)! <= 2) {
    presetKey = "travelReset";
    stationId = "breathing";
    whyToday.push("Travel is close, so the session protects routine without adding load.");
  } else if (nextRace && raceDays !== null && raceDays <= 7) {
    presetKey = "meetEve";
    stationId = "routine";
    whyToday.push("A race is within seven days, so the work shifts toward routine stability.");
  } else if (phase.id === "baseBuild") {
    presetKey = "discomfort";
    stationId = "selfTalk";
    whyToday.push("Base build adds pre-run discomfort scripts and workout transfer.");
  } else if (phase.id === "competitionBuild") {
    presetKey = "championshipConfidence";
    stationId = "imagery";
    whyToday.push("Competition build emphasizes tactical imagery and race execution.");
  } else {
    presetKey = presetForStation(stationId);
    whyToday.push("Foundation work rotates through core pre-run stations to build skill fluency over time.");
  }

  if (hasPoorRecentStation(data, stationId)) {
    stationId = stationId === "breathing" ? "attention" : "breathing";
    presetKey = presetForStation(stationId);
    whyToday.push("The last two attempts in the original station rated poorly, so the app switches or regresses.");
  }

  const stationProgress = data.skillProgress[stationId] ?? { level: 1, successStreak: 0 };
  const station = getStation(stationId);
  const preset = scriptPresets[presetKey] ?? scriptPresets.baseFocus;
  const peakCap = isPeakPhase(phase.id) || isRaceWithin(date, 24) ? 3 : 4;
  const level = mode === "raceDay" ? Math.min(4, Math.max(3, stationProgress.level)) : Math.min(peakCap, stationProgress.level);

  return {
    id: `${presetKey}-${stationId}-${level}`,
    title: preset.title,
    stationId,
    level,
    mode,
    durationMinutes: preset.durationMinutes,
    intent: preset.intent,
    transferContext: preset.transferContext,
    whyToday: [
      ...whyToday,
      `${station.title} is currently level ${level}: ${station.levels[level - 1]?.title ?? "Progressive rep"}.`
    ],
    steps: preset.steps
  };
}

function presetForStation(stationId: StationId) {
  const map: Record<StationId, string> = {
    breathing: "travelReset",
    attention: "baseFocus",
    selfTalk: "discomfort",
    imagery: "championshipConfidence",
    processGoals: "altitudePatience",
    routine: "meetEve",
    reset: "nextRunReset"
  };

  return map[stationId];
}
