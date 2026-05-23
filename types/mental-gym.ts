export type StationId =
  | "breathing"
  | "attention"
  | "selfTalk"
  | "imagery"
  | "processGoals"
  | "routine"
  | "reset";

export type PhaseId =
  | "foundation"
  | "london"
  | "baseBuild"
  | "tuneup"
  | "transition"
  | "bigBear"
  | "competitionBuild"
  | "nuttycombe"
  | "bigTens"
  | "westRegional"
  | "recovery";

export type SessionMode = "daily" | "maintenance" | "raceDay" | "manual";

export type WorkoutType =
  | "easy-run"
  | "long-run"
  | "workout"
  | "race"
  | "travel"
  | "rest"
  | "unsure";

export type ReadinessCheck = {
  stress: number;
  focus: number;
  confidence: number;
  freshness: number;
  workoutType: WorkoutType;
  notes: string;
};

export type Reflection = {
  usefulness: number;
  execution: number;
  carryoverCue: string;
  note: string;
};

export type SessionRecord = {
  id: string;
  date: string;
  completedAt: string;
  phaseId: PhaseId;
  stationId: StationId;
  stationTitle: string;
  level: number;
  mode: SessionMode;
  title: string;
  durationMinutes: number;
  readiness: ReadinessCheck;
  reflection: Reflection;
};

export type SkillProgress = {
  level: number;
  successStreak: number;
};

export type Settings = {
  name: string;
  reducedMotion: boolean;
};

export type MentalGymData = {
  version: number;
  settings: Settings;
  sessions: SessionRecord[];
  customCues: string[];
  skillProgress: Record<StationId, SkillProgress>;
};

export type SeasonEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: "travel" | "race" | "team" | "camp";
  note: string;
};

export type SeasonPhase = {
  id: PhaseId;
  title: string;
  start: string;
  end: string;
  priority: string;
  frequencyGoal: number;
  sessionLength: string;
  color: string;
};

export type SessionStep = {
  label: string;
  duration: string;
  body: string;
  prompts: string[];
};

export type SessionPlan = {
  id: string;
  title: string;
  stationId: StationId;
  level: number;
  mode: SessionMode;
  durationMinutes: number;
  intent: string;
  whyToday: string[];
  transferContext: string;
  steps: {
    regulation: SessionStep;
    primary: SessionStep;
    transfer: SessionStep;
  };
};

export type StationLevel = {
  level: number;
  title: string;
  description: string;
  example: string;
};

export type Station = {
  id: StationId;
  title: string;
  shortTitle: string;
  description: string;
  levels: StationLevel[];
  examples: string[];
};
