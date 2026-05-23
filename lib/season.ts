import type { PhaseId, SeasonEvent, SeasonPhase } from "@/types/mental-gym";

const dayMs = 24 * 60 * 60 * 1000;

export const seasonEvents: SeasonEvent[] = [
  {
    id: "london-departure",
    title: "Fly to London",
    date: "2026-06-11",
    type: "travel",
    note: "Short, forgiving sessions. Keep identity and routine stable across travel."
  },
  {
    id: "london-return",
    title: "Fly Back Home",
    date: "2026-06-21",
    type: "travel",
    note: "Downshift and re-enter the home routine without forcing a perfect reset."
  },
  {
    id: "ten-mile",
    title: "Hard 10-Mile Tune-Up",
    date: "2026-08-08",
    type: "race",
    note: "Calm confidence, effort patience, and no new mental skills."
  },
  {
    id: "ucla-report",
    title: "Report to UCLA",
    date: "2026-08-10",
    time: "8:00 AM",
    type: "team",
    note: "Transition-support phase. Grounding, controllables, and stable routines matter."
  },
  {
    id: "big-bear",
    title: "Big Bear Altitude Camp",
    date: "2026-08-13",
    type: "camp",
    note: "Patience, adaptation humility, group composure, and control what you can."
  },
  {
    id: "nuttycombe",
    title: "Nuttycombe",
    date: "2026-10-16",
    type: "race",
    note: "Major race. Specific imagery, confidence recall, routine compression."
  },
  {
    id: "big-tens",
    title: "Big Tens",
    date: "2026-10-30",
    type: "race",
    note: "Championship composure, tactical patience, routine lock-in."
  },
  {
    id: "west-regional",
    title: "NCAA XC West Regional",
    date: "2026-11-13",
    type: "race",
    note: "Clarity, controlled aggression, and no novelty."
  }
];

export const seasonPhases: SeasonPhase[] = [
  {
    id: "foundation",
    title: "Foundation / Base",
    start: "2026-05-22",
    end: "2026-06-10",
    priority: "Regulation, attention, basic imagery, and simple self-talk.",
    frequencyGoal: 5,
    sessionLength: "5-7 min",
    color: "#2563eb"
  },
  {
    id: "london",
    title: "London Travel Support",
    start: "2026-06-11",
    end: "2026-06-21",
    priority: "Low-friction consistency, travel stress, sleep downshift, flexible routine.",
    frequencyGoal: 4,
    sessionLength: "3-6 min",
    color: "#0f766e"
  },
  {
    id: "baseBuild",
    title: "Base Build / Pre-transition",
    start: "2026-06-22",
    end: "2026-08-04",
    priority: "Workout transfer, confidence, discomfort scripts, and transition prep.",
    frequencyGoal: 5,
    sessionLength: "6-8 min",
    color: "#4f46e5"
  },
  {
    id: "tuneup",
    title: "10-Mile Tune-Up Race Mode",
    start: "2026-08-05",
    end: "2026-08-08",
    priority: "Race routine, calm confidence, controlled aggression, effort patience.",
    frequencyGoal: 4,
    sessionLength: "2-5 min",
    color: "#dc2626"
  },
  {
    id: "transition",
    title: "UCLA Reporting Transition",
    start: "2026-08-09",
    end: "2026-08-12",
    priority: "Grounding, values, controllables, low-drama adaptation, stable routine.",
    frequencyGoal: 4,
    sessionLength: "4-6 min",
    color: "#7c3aed"
  },
  {
    id: "bigBear",
    title: "Big Bear Altitude Camp",
    start: "2026-08-13",
    end: "2026-09-18",
    priority: "Adaptation patience, altitude humility, group composure, routine consistency.",
    frequencyGoal: 5,
    sessionLength: "5-7 min",
    color: "#15803d"
  },
  {
    id: "competitionBuild",
    title: "Competition Build",
    start: "2026-09-19",
    end: "2026-10-09",
    priority: "Race execution, tactical imagery, routine stability, pack running, hills.",
    frequencyGoal: 5,
    sessionLength: "5-7 min",
    color: "#c2410c"
  },
  {
    id: "nuttycombe",
    title: "Nuttycombe Peak Prep",
    start: "2026-10-10",
    end: "2026-10-16",
    priority: "Specific race imagery, confidence recall, routine compression, no novelty.",
    frequencyGoal: 5,
    sessionLength: "4-6 min",
    color: "#be123c"
  },
  {
    id: "bigTens",
    title: "Big Tens Peak Prep",
    start: "2026-10-24",
    end: "2026-10-30",
    priority: "Championship composure, tactical patience, confidence recall, routine lock-in.",
    frequencyGoal: 5,
    sessionLength: "4-6 min",
    color: "#a16207"
  },
  {
    id: "westRegional",
    title: "West Regional Peak Prep",
    start: "2026-11-07",
    end: "2026-11-13",
    priority: "Clarity, confidence, controlled aggression, race-day script, no new skills.",
    frequencyGoal: 5,
    sessionLength: "4-6 min",
    color: "#7f1d1d"
  },
  {
    id: "recovery",
    title: "Recovery / Review",
    start: "2026-11-14",
    end: "2026-12-15",
    priority: "Review transfer, reset the system, and keep a small maintenance habit.",
    frequencyGoal: 3,
    sessionLength: "4-6 min",
    color: "#475569"
  }
];

export function toDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysBetween(start: Date, end: Date) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.ceil((endUtc - startUtc) / dayMs);
}

export function getCurrentPhase(date = new Date()): SeasonPhase {
  const today = dateKey(date);
  const exact = seasonPhases.find((phase) => today >= phase.start && today <= phase.end);

  if (exact) {
    return exact;
  }

  if (today >= "2026-10-17" && today <= "2026-10-23") {
    return {
      ...seasonPhases.find((phase) => phase.id === "competitionBuild")!,
      title: "Championship Bridge",
      start: "2026-10-17",
      end: "2026-10-23",
      priority: "Recover from Nuttycombe, preserve routine stability, and prepare for Big Tens."
    };
  }

  if (today >= "2026-10-31" && today <= "2026-11-06") {
    return {
      ...seasonPhases.find((phase) => phase.id === "competitionBuild")!,
      title: "Regional Bridge",
      start: "2026-10-31",
      end: "2026-11-06",
      priority: "Absorb Big Tens, sharpen confidence, and keep the routine simple."
    };
  }

  return today < seasonPhases[0].start ? seasonPhases[0] : seasonPhases[seasonPhases.length - 1];
}

export function getNextEvent(date = new Date()) {
  const today = dateKey(date);
  return seasonEvents.find((event) => event.date >= today) ?? null;
}

export function getNextRace(date = new Date()) {
  const today = dateKey(date);
  return seasonEvents.find((event) => event.type === "race" && event.date >= today) ?? null;
}

export function daysUntilEvent(event: SeasonEvent | null, date = new Date()) {
  if (!event) {
    return null;
  }

  return daysBetween(date, toDate(event.date));
}

export function isRaceWithin(date: Date, hours: number) {
  const nextRace = getNextRace(date);

  if (!nextRace) {
    return false;
  }

  const raceDate = toDate(nextRace.date);
  const diffHours = (raceDate.getTime() - new Date(dateKey(date)).getTime()) / (60 * 60 * 1000);
  return diffHours >= 0 && diffHours <= hours;
}

export function isPeakPhase(phaseId: PhaseId) {
  return phaseId === "nuttycombe" || phaseId === "bigTens" || phaseId === "westRegional" || phaseId === "tuneup";
}
