"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  addCompletedSession,
  exportMentalGymData,
  importMentalGymData,
  loadMentalGymData,
  resetMentalGymData,
  saveMentalGymData
} from "@/lib/storage";
import { getRecommendation } from "@/lib/recommendation";
import {
  dateKey,
  daysUntilEvent,
  getCurrentPhase,
  getNextEvent,
  getNextRace,
  seasonEvents,
  seasonPhases,
  toDate
} from "@/lib/season";
import { getAdherence, getLatestAverages, getMetricTrend, getSessionsThisWeek } from "@/lib/analytics";
import { getStation, stations } from "@/lib/stations";
import { loadSyncSecret, mergeMentalGymData, pullCloudData, pushCloudData, saveSyncSecret } from "@/lib/sync";
import type {
  MentalGymData,
  ReadinessCheck,
  Reflection,
  SessionPlan,
  SessionRecord,
  StationId,
  WorkoutType
} from "@/types/mental-gym";

type TabId = "today" | "progress" | "season" | "library" | "settings";
type SessionStepId = "readiness" | "regulation" | "primary" | "transfer" | "reflection";

const tabs: { id: TabId; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "progress", label: "Progress" },
  { id: "season", label: "Season" },
  { id: "library", label: "Stations" },
  { id: "settings", label: "Settings" }
];

const sessionSteps: { id: SessionStepId; label: string }[] = [
  { id: "readiness", label: "Check" },
  { id: "regulation", label: "Prime" },
  { id: "primary", label: "Skill" },
  { id: "transfer", label: "Transfer" },
  { id: "reflection", label: "Reflect" }
];

const workoutTypes: { value: WorkoutType; label: string }[] = [
  { value: "easy-run", label: "Easy run" },
  { value: "long-run", label: "Long run" },
  { value: "workout", label: "Workout" },
  { value: "race", label: "Race" },
  { value: "travel", label: "Travel" },
  { value: "rest", label: "Rest" },
  { value: "unsure", label: "Unsure" }
];

const emptyReadiness: ReadinessCheck = {
  stress: 5,
  focus: 5,
  confidence: 5,
  freshness: 5,
  workoutType: "unsure",
  notes: ""
};

const emptyReflection: Reflection = {
  usefulness: 7,
  execution: 7,
  carryoverCue: "",
  note: ""
};

export function MentalGymApp() {
  const [data, setData] = useState<MentalGymData>(() => loadMentalGymData());
  const [activeTab, setActiveTab] = useState<TabId>("today");
  const [activePlan, setActivePlan] = useState<SessionPlan | null>(null);
  const [sessionStepIndex, setSessionStepIndex] = useState(0);
  const [readiness, setReadiness] = useState<ReadinessCheck>(emptyReadiness);
  const [reflection, setReflection] = useState<Reflection>(emptyReflection);
  const [importText, setImportText] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [syncSecret, setSyncSecret] = useState(() => loadSyncSecret());
  const [syncMessage, setSyncMessage] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    saveMentalGymData(data);
    document.documentElement.dataset.reducedMotion = data.settings.reducedMotion ? "true" : "false";
  }, [data]);

  const today = useMemo(() => new Date(), []);
  const phase = getCurrentPhase(today);
  const recommendation = data ? getRecommendation(data, today) : null;

  if (!recommendation) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-6 text-slate-950">
        <div className="mx-auto max-w-5xl">
          <div className="h-32 rounded-lg border border-slate-200 bg-white" />
        </div>
      </main>
    );
  }

  function startSession(plan: SessionPlan) {
    setActivePlan(plan);
    setSessionStepIndex(0);
    setReadiness(emptyReadiness);
    setReflection(emptyReflection);
  }

  function completeSession() {
    if (!activePlan || !data) {
      return;
    }

    const station = getStation(activePlan.stationId);
    const record: SessionRecord = {
      id: createId(),
      date: dateKey(new Date()),
      completedAt: new Date().toISOString(),
      phaseId: getCurrentPhase(new Date()).id,
      stationId: activePlan.stationId,
      stationTitle: station.title,
      level: activePlan.level,
      mode: activePlan.mode,
      title: activePlan.title,
      durationMinutes: activePlan.durationMinutes,
      readiness,
      reflection
    };

    const nextData = addCompletedSession(data, record);
    setData(nextData);
    void autoPush(nextData);
    setActivePlan(null);
    setSessionStepIndex(0);
    setActiveTab("progress");
  }

  async function autoPush(nextData: MentalGymData) {
    const secret = loadSyncSecret();

    if (!secret) {
      return;
    }

    try {
      await pushCloudData(secret, nextData);
      setSyncMessage("Auto-synced after your session.");
    } catch {
      setSyncMessage("Session saved locally. Cloud sync needs attention in Settings.");
    }
  }

  async function handlePushCloud() {
    if (!data || !syncSecret.trim()) {
      setSyncMessage("Enter your sync passcode first.");
      return;
    }

    setIsSyncing(true);
    setSyncMessage("");

    try {
      saveSyncSecret(syncSecret);
      await pushCloudData(syncSecret.trim(), data);
      setSyncMessage("Pushed this device's data to cloud sync.");
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "Cloud push failed.");
    } finally {
      setIsSyncing(false);
    }
  }

  async function handlePullCloud() {
    if (!data || !syncSecret.trim()) {
      setSyncMessage("Enter your sync passcode first.");
      return;
    }

    setIsSyncing(true);
    setSyncMessage("");

    try {
      saveSyncSecret(syncSecret);
      const cloud = await pullCloudData(syncSecret.trim());

      if (!cloud) {
        setSyncMessage("No cloud data yet. Push from your main device first.");
        return;
      }

      const merged = mergeMentalGymData(data, cloud);
      setData(merged);
      setSyncMessage("Pulled and merged cloud data onto this device.");
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "Cloud pull failed.");
    } finally {
      setIsSyncing(false);
    }
  }

  if (activePlan) {
    return (
      <SessionFlow
        plan={activePlan}
        stepIndex={sessionStepIndex}
        readiness={readiness}
        reflection={reflection}
        onReadinessChange={setReadiness}
        onReflectionChange={setReflection}
        onBack={() => (sessionStepIndex === 0 ? setActivePlan(null) : setSessionStepIndex(sessionStepIndex - 1))}
        onNext={() =>
          sessionStepIndex === sessionSteps.length - 1 ? completeSession() : setSessionStepIndex(sessionStepIndex + 1)
        }
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f0ea] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:grid lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-slate-200/80 bg-white/70 px-4 py-6 lg:block">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Mental Gym</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">UCLA XC Room</h1>
          </div>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                  activeTab === tab.id ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-[#f3f0ea]/90 px-4 py-4 backdrop-blur lg:px-8">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Mental Gym</p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Personal XC performance room</h1>
              </div>
              <button
                className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                onClick={() => startSession(recommendation)}
                type="button"
              >
                Start
              </button>
            </div>
          </header>

          <section className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-5 lg:px-8 lg:pb-10">
            {activeTab === "today" && (
              <TodayView data={data} date={today} recommendation={recommendation} onStart={startSession} />
            )}
            {activeTab === "progress" && <ProgressView data={data} phaseGoal={phase.frequencyGoal} />}
            {activeTab === "season" && <SeasonView date={today} />}
            {activeTab === "library" && <LibraryView data={data} onStart={(stationId) => startSession(getRecommendation(data, today, stationId))} />}
            {activeTab === "settings" && (
              <SettingsView
                data={data}
                importMessage={importMessage}
                importText={importText}
                isSyncing={isSyncing}
                onDataChange={(nextData) => setData(nextData)}
                onImportMessage={setImportMessage}
                onImportText={setImportText}
                onPullCloud={handlePullCloud}
                onPushCloud={handlePushCloud}
                onSyncSecretChange={(secret) => {
                  setSyncSecret(secret);
                  saveSyncSecret(secret);
                }}
                syncMessage={syncMessage}
                syncSecret={syncSecret}
              />
            )}
          </section>

          <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-2 pb-3 pt-2 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] lg:hidden">
            <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
              {tabs.map((tab) => (
                <button
                  className={`rounded-md px-2 py-2 text-xs font-semibold ${
                    activeTab === tab.id ? "bg-slate-950 text-white" : "text-slate-500"
                  }`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </main>
  );
}

function TodayView({
  data,
  date,
  recommendation,
  onStart
}: {
  data: MentalGymData;
  date: Date;
  recommendation: SessionPlan;
  onStart: (plan: SessionPlan) => void;
}) {
  const phase = getCurrentPhase(date);
  const nextEvent = getNextEvent(date);
  const nextRace = getNextRace(date);
  const eventDays = daysUntilEvent(nextEvent, date);
  const raceDays = daysUntilEvent(nextRace, date);
  const adherence = getAdherence(data, phase.frequencyGoal, date);
  const averages = getLatestAverages(data);

  return (
    <div className="space-y-5">
      <section className="rounded-lg bg-slate-950 p-5 text-white shadow-sm">
        <p className="text-sm text-slate-300">
          {date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-slate-300">{data.settings.name}&apos;s room</p>
            <h2 className="text-3xl font-semibold tracking-tight">{phase.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{phase.priority}</p>
          </div>
          <div className="rounded-md border border-white/15 bg-white/10 p-3 text-sm">
            <p className="text-slate-300">Next event</p>
            <p className="mt-1 font-semibold">{nextEvent?.title ?? "Season review"}</p>
            <p className="text-slate-300">{eventDays === null ? "No dated event" : `${eventDays} days`}</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Recommended session</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{recommendation.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{recommendation.intent}</p>
          </div>
          <Pill>{recommendation.durationMinutes} min</Pill>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <InfoTile label="Station" value={getStation(recommendation.stationId).title} />
          <InfoTile label="Level" value={`${recommendation.level} of 4`} />
          <InfoTile label="Race clock" value={raceDays === null ? "No race left" : `${raceDays} days`} />
        </div>
        <button
          className="mt-5 w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm"
          onClick={() => onStart(recommendation)}
          type="button"
        >
          Start today&apos;s mental workout
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="This week" value={`${adherence.completed}/${adherence.goal}`} sublabel="sessions completed" />
        <MetricCard label="Stress" value={formatAverage(averages.stress)} sublabel="recent avg" />
        <MetricCard label="Focus" value={formatAverage(averages.focus)} sublabel="recent avg" />
        <MetricCard label="Confidence" value={formatAverage(averages.confidence)} sublabel="recent avg" />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-950">Why today?</p>
        <div className="mt-3 space-y-2">
          {recommendation.whyToday.map((reason) => (
            <p className="rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700" key={reason}>
              {reason}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

function SessionFlow({
  plan,
  stepIndex,
  readiness,
  reflection,
  onReadinessChange,
  onReflectionChange,
  onBack,
  onNext
}: {
  plan: SessionPlan;
  stepIndex: number;
  readiness: ReadinessCheck;
  reflection: Reflection;
  onReadinessChange: (value: ReadinessCheck) => void;
  onReflectionChange: (value: Reflection) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const step = sessionSteps[stepIndex];
  const progress = ((stepIndex + 1) / sessionSteps.length) * 100;

  return (
    <main className="min-h-screen bg-[#f3f0ea] px-4 py-5 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-2xl flex-col">
        <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{step.label}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">{plan.title}</h1>
            </div>
            <Pill>{plan.durationMinutes} min</Pill>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-slate-950" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-5 gap-1">
            {sessionSteps.map((item, index) => (
              <div
                className={`h-1.5 rounded-full ${index <= stepIndex ? "bg-slate-950" : "bg-slate-200"}`}
                key={item.id}
              />
            ))}
          </div>
        </header>

        <section className="mt-4 flex-1 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          {step.id === "readiness" && <ReadinessStep readiness={readiness} onChange={onReadinessChange} />}
          {step.id === "regulation" && <GuidedStep step={plan.steps.regulation} />}
          {step.id === "primary" && <GuidedStep step={plan.steps.primary} />}
          {step.id === "transfer" && <GuidedStep step={plan.steps.transfer} transferContext={plan.transferContext} />}
          {step.id === "reflection" && <ReflectionStep reflection={reflection} onChange={onReflectionChange} />}
        </section>

        <footer className="mt-4 grid grid-cols-[1fr_1.4fr] gap-3">
          <button className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold" onClick={onBack} type="button">
            Back
          </button>
          <button className="rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white" onClick={onNext} type="button">
            {step.id === "reflection" ? "Complete session" : "Continue"}
          </button>
        </footer>
      </div>
    </main>
  );
}

function ReadinessStep({
  readiness,
  onChange
}: {
  readiness: ReadinessCheck;
  onChange: (value: ReadinessCheck) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Readiness check</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Twenty to forty seconds. Rate what is here, then move on.</p>
      </div>
      <Slider label="Stress / arousal" value={readiness.stress} onChange={(stress) => onChange({ ...readiness, stress })} />
      <Slider label="Focus" value={readiness.focus} onChange={(focus) => onChange({ ...readiness, focus })} />
      <Slider label="Confidence" value={readiness.confidence} onChange={(confidence) => onChange({ ...readiness, confidence })} />
      <Slider label="Mental freshness" value={readiness.freshness} onChange={(freshness) => onChange({ ...readiness, freshness })} />
      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Upcoming run</span>
        <select
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm"
          onChange={(event) => onChange({ ...readiness, workoutType: event.target.value as WorkoutType })}
          value={readiness.workoutType}
        >
          {workoutTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Optional note</span>
        <textarea
          className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-3 text-sm"
          onChange={(event) => onChange({ ...readiness, notes: event.target.value })}
          placeholder="One line is plenty."
          value={readiness.notes}
        />
      </label>
    </div>
  );
}

function GuidedStep({ step, transferContext }: { step: SessionPlan["steps"]["primary"]; transferContext?: string }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">{step.label}</h2>
          <Pill>{step.duration}</Pill>
        </div>
        <p className="mt-3 text-base leading-7 text-slate-700">{step.body}</p>
      </div>
      <div className="grid gap-2">
        {step.prompts.map((prompt) => (
          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800" key={prompt}>
            {prompt}
          </div>
        ))}
      </div>
      {transferContext && (
        <div className="rounded-md bg-amber-50 px-3 py-3 text-sm leading-6 text-amber-950">
          <span className="font-semibold">Scene:</span> {transferContext}
        </div>
      )}
      <Timer key={`${step.label}-${step.duration}`} seconds={parseDuration(step.duration)} />
    </div>
  );
}

function ReflectionStep({
  reflection,
  onChange
}: {
  reflection: Reflection;
  onChange: (value: Reflection) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Reflection</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Twenty to thirty seconds. The cue matters more than the paragraph.</p>
      </div>
      <Slider label="How useful was this?" value={reflection.usefulness} onChange={(usefulness) => onChange({ ...reflection, usefulness })} />
      <Slider label="How well did you execute it?" value={reflection.execution} onChange={(execution) => onChange({ ...reflection, execution })} />
      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Cue to carry into the next run</span>
        <input
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm"
          onChange={(event) => onChange({ ...reflection, carryoverCue: event.target.value })}
          placeholder="Example: Position, rhythm, patience."
          value={reflection.carryoverCue}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-slate-800">Optional note</span>
        <textarea
          className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-3 text-sm"
          onChange={(event) => onChange({ ...reflection, note: event.target.value })}
          placeholder="What should future you remember?"
          value={reflection.note}
        />
      </label>
    </div>
  );
}

function ProgressView({ data, phaseGoal }: { data: MentalGymData; phaseGoal: number }) {
  const adherence = getAdherence(data, phaseGoal);
  const weeklySessions = getSessionsThisWeek(data);
  const averages = getLatestAverages(data);

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Progress</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Training log that stays useful</h2>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Weekly adherence</h3>
            <p className="mt-1 text-sm text-slate-600">Sessions completed this week, without punitive streaks.</p>
          </div>
          <Pill>{adherence.completed}/{adherence.goal}</Pill>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-slate-950" style={{ width: `${Math.min(100, adherence.rate * 100)}%` }} />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          <MetricCard label="Stress" value={formatAverage(averages.stress)} sublabel="recent" compact />
          <MetricCard label="Focus" value={formatAverage(averages.focus)} sublabel="recent" compact />
          <MetricCard label="Confidence" value={formatAverage(averages.confidence)} sublabel="recent" compact />
          <MetricCard label="Freshness" value={formatAverage(averages.freshness)} sublabel="recent" compact />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <TrendCard label="Stress" values={getMetricTrend(data, "stress")} />
        <TrendCard label="Focus" values={getMetricTrend(data, "focus")} />
        <TrendCard label="Confidence" values={getMetricTrend(data, "confidence")} />
        <TrendCard label="Freshness" values={getMetricTrend(data, "freshness")} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Recent carryover cues</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {data.customCues.length ? (
            data.customCues.slice(0, 10).map((cue) => <Pill key={cue}>{cue}</Pill>)
          ) : (
            <p className="text-sm text-slate-600">Complete a session and save one cue for the next run.</p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Session history</h3>
          <span className="text-sm text-slate-500">{weeklySessions.length} this week</span>
        </div>
        <div className="mt-4 space-y-3">
          {data.sessions.length ? (
            data.sessions.slice(0, 12).map((session) => (
              <article className="rounded-md border border-slate-200 p-3" key={session.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{session.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {session.date} · {session.stationTitle} L{session.level}
                    </p>
                  </div>
                  <Pill>{session.durationMinutes} min</Pill>
                </div>
                {session.reflection.carryoverCue && (
                  <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">{session.reflection.carryoverCue}</p>
                )}
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-600">No sessions yet. Today can be the first clean rep.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function SeasonView({ date }: { date: Date }) {
  const phase = getCurrentPhase(date);
  const start = toDate("2026-05-22");
  const end = toDate("2026-11-13");
  const total = Math.max(1, end.getTime() - start.getTime());
  const current = Math.min(100, Math.max(0, ((date.getTime() - start.getTime()) / total) * 100));

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Season plan</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">From base to West Regional</h2>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Current phase</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{phase.priority}</p>
          </div>
          <Pill>{phase.sessionLength}</Pill>
        </div>
        <div className="relative mt-5 h-3 rounded-full bg-slate-100">
          <div className="absolute inset-y-0 left-0 rounded-full bg-slate-950" style={{ width: `${current}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>May 22</span>
          <span>Nov 13</span>
        </div>
      </section>

      <section className="space-y-3">
        {seasonEvents.map((event) => {
          const days = daysUntilEvent(event, date);
          const isPast = days !== null && days < 0;
          return (
            <article
              className={`rounded-lg border p-4 shadow-sm ${
                isPast ? "border-slate-200 bg-white/70 text-slate-500" : "border-slate-200 bg-white"
              }`}
              key={event.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{formatEventDate(event.date, event.time)}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-950">{event.title}</h3>
                  <p className="mt-2 text-sm leading-6">{event.note}</p>
                </div>
                <Pill>{days === null ? "Done" : days < 0 ? "Past" : `${days}d`}</Pill>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-3">
        {seasonPhases.map((item) => (
          <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={item.id}>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.id === phase.id && <Pill>Now</Pill>}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {formatEventDate(item.start)} to {formatEventDate(item.end)}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item.priority}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function LibraryView({ data, onStart }: { data: MentalGymData; onStart: (stationId: StationId) => void }) {
  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Stations</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Skill rooms for XC demands</h2>
      </section>

      <section className="grid gap-4">
        {stations.map((station) => {
          const progress = data.skillProgress[station.id];
          return (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={station.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">{station.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{station.description}</p>
                </div>
                <Pill>L{progress?.level ?? 1}</Pill>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {station.levels.map((level) => (
                  <div
                    className={`rounded-md border p-3 ${
                      level.level === (progress?.level ?? 1) ? "border-slate-950 bg-slate-50" : "border-slate-200"
                    }`}
                    key={level.level}
                  >
                    <p className="text-sm font-semibold">
                      Level {level.level}: {level.title}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{level.example}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {station.examples.map((example) => (
                  <Pill key={example}>{example}</Pill>
                ))}
              </div>
              <button
                className="mt-4 w-full rounded-md border border-slate-950 px-4 py-3 text-sm font-semibold text-slate-950"
                onClick={() => onStart(station.id)}
                type="button"
              >
                Start this station
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function SettingsView({
  data,
  importText,
  importMessage,
  syncSecret,
  syncMessage,
  isSyncing,
  onDataChange,
  onImportText,
  onImportMessage,
  onSyncSecretChange,
  onPullCloud,
  onPushCloud
}: {
  data: MentalGymData;
  importText: string;
  importMessage: string;
  syncSecret: string;
  syncMessage: string;
  isSyncing: boolean;
  onDataChange: (data: MentalGymData) => void;
  onImportText: (value: string) => void;
  onImportMessage: (value: string) => void;
  onSyncSecretChange: (value: string) => void;
  onPullCloud: () => void;
  onPushCloud: () => void;
}) {
  function downloadExport() {
    const blob = new Blob([exportMentalGymData(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mental-gym-export-${dateKey(new Date())}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    try {
      const imported = importMentalGymData(importText);
      onDataChange(imported);
      onImportMessage("Import complete.");
      onImportText("");
    } catch {
      onImportMessage("Import failed. Paste a valid Mental Gym JSON export.");
    }
  }

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Settings</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Private local-first setup</h2>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Personalization</h3>
        <label className="mt-4 block">
          <span className="text-sm font-semibold text-slate-800">Name</span>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm"
            onChange={(event) => onDataChange({ ...data, settings: { ...data.settings, name: event.target.value } })}
            value={data.settings.name}
          />
        </label>
        <label className="mt-4 flex items-center justify-between gap-4 rounded-md border border-slate-200 px-3 py-3">
          <span>
            <span className="block text-sm font-semibold">Reduced motion</span>
            <span className="block text-sm text-slate-600">Keep transitions as quiet as possible.</span>
          </span>
          <input
            checked={data.settings.reducedMotion}
            className="h-5 w-5"
            onChange={(event) =>
              onDataChange({ ...data, settings: { ...data.settings, reducedMotion: event.target.checked } })
            }
            type="checkbox"
          />
        </label>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Data</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Data is stored locally first. Cloud sync can copy the same private training log between your phone and computer.
        </p>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-semibold">Cloud sync</h4>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Use the same sync passcode on every device. Push from the device with the latest data, then pull on the other device.
          </p>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-800">Sync passcode</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm"
              onChange={(event) => onSyncSecretChange(event.target.value)}
              placeholder="Same value as MENTAL_GYM_SYNC_SECRET"
              type="password"
              value={syncSecret}
            />
          </label>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              className="rounded-md border border-slate-950 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
              disabled={isSyncing}
              onClick={onPullCloud}
              type="button"
            >
              Pull from cloud
            </button>
            <button
              className="rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              disabled={isSyncing}
              onClick={onPushCloud}
              type="button"
            >
              Push to cloud
            </button>
          </div>
          {syncMessage && <p className="mt-3 text-sm text-slate-600">{syncMessage}</p>}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button className="rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white" onClick={downloadExport} type="button">
            Export JSON
          </button>
          <button
            className="rounded-md border border-red-300 px-4 py-3 text-sm font-semibold text-red-700"
            onClick={() => {
              if (window.confirm("Reset all local Mental Gym data in this browser?")) {
                onDataChange(resetMentalGymData());
              }
            }}
            type="button"
          >
            Reset local data
          </button>
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-semibold text-slate-800">Import JSON</span>
          <textarea
            className="mt-2 min-h-32 w-full rounded-md border border-slate-300 px-3 py-3 text-sm"
            onChange={(event) => onImportText(event.target.value)}
            placeholder="Paste a Mental Gym export here."
            value={importText}
          />
        </label>
        <button className="mt-3 rounded-md border border-slate-950 px-4 py-3 text-sm font-semibold" onClick={handleImport} type="button">
          Import
        </button>
        {importMessage && <p className="mt-3 text-sm text-slate-600">{importMessage}</p>}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Performance, not clinical care</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Mental Gym is a sport-specific performance practice tool. It does not diagnose, screen for, treat, or monitor mental
          health conditions. If you are in immediate danger or might hurt yourself, call 911 or 988 in the United States. For ongoing
          distress, work with a licensed clinician or UCLA support resource.
        </p>
      </section>
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-800">
        {label}
        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-sm">{value}</span>
      </span>
      <input
        className="mt-3 w-full accent-slate-950"
        max={10}
        min={0}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
    </label>
  );
}

function Timer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remaining <= 0) {
      return;
    }

    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [remaining, running]);

  const percent = seconds ? ((seconds - remaining) / seconds) * 100 : 0;

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-3xl font-semibold">{formatTime(remaining)}</span>
        <button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => {
            if (remaining === 0) {
              setRemaining(seconds);
              setRunning(true);
              return;
            }

            setRunning(!running);
          }}
          type="button"
        >
          {running ? "Pause" : remaining === 0 ? "Restart" : "Start timer"}
        </button>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-slate-950" style={{ width: `${remaining === 0 ? 100 : percent}%` }} />
      </div>
      {remaining === 0 && <p className="mt-3 text-sm font-semibold text-slate-700">Time. Carry the cue forward.</p>}
    </div>
  );
}

function TrendCard({ label, values }: { label: string; values: number[] }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{label}</h3>
        <span className="text-sm text-slate-500">{values.length ? `${values[values.length - 1]}/10` : "No data"}</span>
      </div>
      <div className="mt-4 flex h-24 items-end gap-2">
        {values.length ? (
          values.map((value, index) => (
            <div className="flex flex-1 flex-col justify-end" key={`${value}-${index}`}>
              <div className="rounded-t-md bg-slate-950" style={{ height: `${Math.max(8, value * 9)}%` }} />
            </div>
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-50 text-sm text-slate-500">
            Complete sessions to build a trend.
          </div>
        )}
      </div>
    </article>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sublabel,
  compact = false
}: {
  label: string;
  value: string;
  sublabel: string;
  compact?: boolean;
}) {
  return (
    <article className={`rounded-lg border border-slate-200 bg-white shadow-sm ${compact ? "p-3" : "p-4"}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className={`${compact ? "mt-1 text-2xl" : "mt-2 text-3xl"} font-semibold tracking-tight`}>{value}</p>
      <p className="mt-1 text-sm text-slate-500">{sublabel}</p>
    </article>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}

function formatAverage(value: number | null) {
  return value === null ? "--" : value.toFixed(1);
}

function formatEventDate(value: string, time?: string) {
  const formatted = toDate(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return time ? `${formatted}, ${time}` : formatted;
}

function parseDuration(value: string) {
  const [amountRaw, unit] = value.split(" ");
  const amount = Number(amountRaw);

  if (Number.isNaN(amount)) {
    return 60;
  }

  return unit.startsWith("min") ? amount * 60 : amount;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = `${seconds % 60}`.padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
