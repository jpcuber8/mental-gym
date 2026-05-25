import type { PhaseId, SeasonEvent, SeasonPhase, SessionMode, SessionPlan, SessionStep, StationId } from "@/types/mental-gym";

type SessionContentContext = {
  phase: SeasonPhase;
  mode: SessionMode;
  nextEvent: SeasonEvent | null;
  nextRace: SeasonEvent | null;
  presetKey: string;
  raceDays: number | null;
  stationId: StationId;
  level: number;
};

type SessionContent = Pick<SessionPlan, "durationMinutes" | "intent" | "steps" | "title" | "transferContext">;

type PhaseFrame = {
  title: string;
  intent: string;
  regulation: string;
  scene: string;
  transferDemand: string;
  prompts: string[];
};

const stationNames: Record<StationId, string> = {
  breathing: "Breathing",
  attention: "Attention",
  selfTalk: "Self-talk",
  imagery: "Imagery",
  processGoals: "Process Goals",
  routine: "Routine",
  reset: "Reset"
};

export function buildSessionContent({
  phase,
  mode,
  nextEvent,
  nextRace,
  presetKey,
  raceDays,
  stationId,
  level
}: SessionContentContext): SessionContent {
  const frame = getPhaseFrame(phase, nextEvent, nextRace, raceDays);
  const stationRep = getStationRep(stationId, level);
  const durationMinutes = getDurationMinutes(phase.id, mode, presetKey, raceDays);
  const isRaceDay = mode === "raceDay" || raceDays === 0;
  const title = `${stationNames[stationId]} L${level}: ${isRaceDay ? "Race-Day Compression" : frame.title}`;

  return {
    title,
    durationMinutes,
    intent: `${frame.intent} Today's skill is ${stationNames[stationId].toLowerCase()} level ${level}: ${stationRep.intent}`,
    transferContext: frame.scene,
    steps: {
      regulation: buildRegulationStep(frame, durationMinutes),
      primary: {
        label: "Primary Skill Rep",
        duration: stationRep.duration,
        body: stationRep.body,
        prompts: stationRep.prompts
      },
      transfer: buildTransferStep(stationId, level, frame, isRaceDay)
    }
  };
}

function getDurationMinutes(phaseId: PhaseId, mode: SessionMode, presetKey: string, raceDays: number | null) {
  if (mode === "raceDay" || raceDays === 0) {
    return 3;
  }

  if (mode === "maintenance" || presetKey === "maintenance") {
    return 3;
  }

  if (phaseId === "london") {
    return 4;
  }

  if (phaseId === "transition" || phaseId === "tuneup") {
    return 5;
  }

  if (phaseId === "nuttycombe" || phaseId === "bigTens" || phaseId === "westRegional") {
    return 5;
  }

  return 6;
}

function buildRegulationStep(frame: PhaseFrame, durationMinutes: number): SessionStep {
  return {
    label: "Regulation Primer",
    duration: durationMinutes <= 3 ? "45 sec" : "75 sec",
    body: frame.regulation,
    prompts: frame.prompts
  };
}

function buildTransferStep(stationId: StationId, level: number, frame: PhaseFrame, isRaceDay: boolean): SessionStep {
  return {
    label: "XC Transfer Rep",
    duration: isRaceDay ? "60 sec" : "90 sec",
    body: `${frame.transferDemand} Apply ${stationNames[stationId].toLowerCase()} level ${level}: ${getTransferAction(stationId, level)}`,
    prompts: getTransferPrompts(stationId, frame)
  };
}

function getPhaseFrame(
  phase: SeasonPhase,
  nextEvent: SeasonEvent | null,
  nextRace: SeasonEvent | null,
  raceDays: number | null
): PhaseFrame {
  const race = formatRaceTarget(nextRace, raceDays);
  const eventTitle = nextEvent?.title ?? "the next training demand";

  const frames: Record<PhaseId, PhaseFrame> = {
    foundation: {
      title: "Base Rhythm",
      intent: "Use this before the run to build the basic mental skills that make later race work automatic.",
      regulation: "Breathe in for four and out for six. Let calm be useful, not perfect. Your job is to enter the run steady enough to practice one skill.",
      scene: "Today's base run: rhythm, relaxed shoulders, simple attention, and one cue carried into the first mile.",
      transferDemand: "Preview a normal run where attention wanders or pace shifts slightly.",
      prompts: ["Inhale 4", "Exhale 6", "One skill today"]
    },
    london: {
      title: "Travel Consistency",
      intent: "Use this before the travel-day run, walk, or mobility block to protect rhythm without forcing a normal-day standard.",
      regulation: "Breathe slowly and lower the standard on purpose. Travel mental training is about staying connected, not proving toughness.",
      scene: `Travel context around ${eventTitle}: flexible routine, disrupted sleep, and one small controllable before movement.`,
      transferDemand: "Preview training with imperfect timing, sleep, or surroundings.",
      prompts: ["Short standard", "Stable anchor", "No perfection tax"]
    },
    baseBuild: {
      title: "Workout Transfer",
      intent: "Use this before the run to connect the mental skill to workouts, discomfort, and summer-to-team transition prep.",
      regulation: "Take five slower breaths. Give the body space before the workout or run asks for more effort.",
      scene: "Today's base-build run or workout: discomfort arrives, comparison may show up, and the response stays controllable.",
      transferDemand: "Preview the first moment the session gets uncomfortable or emotionally loud.",
      prompts: ["Long exhale", "One controllable", "Carry the cue"]
    },
    tuneup: {
      title: raceDays === 0 ? "Tune-Up Race Day" : "Tune-Up Race Prep",
      intent: "Use this before the tune-up race context to keep confidence calm, effort patient, and novelty low.",
      regulation: "Two or three slow exhales. Let the body be activated without turning the tune-up into a verdict.",
      scene: `${race}: hard but non-UCLA-associated, useful as a controlled aggression and effort-patience rep.`,
      transferDemand: "Preview the race asking for patience early and commitment late.",
      prompts: ["Calm confidence", "Effort patience", "No verdict"]
    },
    transition: {
      title: "UCLA Transition Grounding",
      intent: "Use this before the run to ground the reporting transition in controllables, values, and stable routine.",
      regulation: "Slow the breath and notice the feet, room, and next hour. You do not have to solve the whole season before this run.",
      scene: "Today's UCLA transition context: team environment, comparison pressure, new rhythm, and one steady pre-run action.",
      transferDemand: "Preview entering the team environment and then settling into the run.",
      prompts: ["Feet", "Next hour", "Learn, settle, contribute"]
    },
    bigBear: {
      title: "Altitude Camp Patience",
      intent: "Use this before the run to practice altitude patience, group composure, and confidence without forcing.",
      regulation: "Let the breath be easy rather than impressive. Altitude rewards patience, humility, and the next controllable.",
      scene: "Today's Big Bear run: altitude sensations, group rhythm, strange legs, and pressure to compare.",
      transferDemand: "Preview a run where the body feels different than expected.",
      prompts: ["Easy breath", "Effort honesty", "No forcing"]
    },
    competitionBuild: {
      title: phase.title.includes("Bridge") ? phase.title : "Race Execution",
      intent: "Use this before the run to sharpen race execution, tactical focus, and routine stability.",
      regulation: "Settle the breath without getting sleepy. The skill now is composed readiness: calm enough to choose, sharp enough to respond.",
      scene: `Today's competition-build context: pack running, hills, surges, routine stability, and ${race}.`,
      transferDemand: "Preview a race-like run where pack position, terrain, or a surge asks for a response.",
      prompts: ["Composed readiness", "Position", "Respond"]
    },
    nuttycombe: {
      title: "Nuttycombe Peak Prep",
      intent: "Use this before the run or warm-up to rehearse specific race confidence, routine compression, and no novelty.",
      regulation: "Two slow exhales and one clear cue. Peak week is not the time to search. It is the time to trust what is already trained.",
      scene: `${race}: specific imagery, confidence recall, first-k patience, and controlled aggression.`,
      transferDemand: "Preview the race asking a specific tactical question.",
      prompts: ["No novelty", "Specific proof", "First-k patience"]
    },
    bigTens: {
      title: "Big Tens Peak Prep",
      intent: "Use this before the run or warm-up to rehearse championship composure and routine lock-in.",
      regulation: "Breathe long enough to stop chasing a feeling. Confidence can be quiet and still be real.",
      scene: `${race}: championship composure, tactical patience, confidence recall, and routine lock-in.`,
      transferDemand: "Preview a championship moment where patience matters before aggression.",
      prompts: ["Composure", "Tactical patience", "Lock in"]
    },
    westRegional: {
      title: "West Regional Peak Prep",
      intent: "Use this before the run or warm-up to keep the script clear, confident, and low novelty.",
      regulation: "Two slow exhales. Clear eyes. The goal is not more information. The goal is a simple race-ready response.",
      scene: `${race}: clarity, confidence, controlled aggression, and the race-day script already compressed.`,
      transferDemand: "Preview the race asking for clarity under pressure.",
      prompts: ["Clear", "Confident", "Commit"]
    },
    recovery: {
      title: "Review and Reset",
      intent: "Use this before a recovery run or review block to keep the habit alive and pull lessons forward.",
      regulation: "Breathe slowly and let the nervous system step down. Recovery mental work should clarify, not grind.",
      scene: "Today's recovery context: easy movement, review, and one lesson carried forward.",
      transferDemand: "Preview using the skill lightly without turning recovery into another performance test.",
      prompts: ["Step down", "One lesson", "Easy carryover"]
    }
  };

  return frames[phase.id];
}

function formatRaceTarget(nextRace: SeasonEvent | null, raceDays: number | null) {
  if (!nextRace || raceDays === null) {
    return "the next race";
  }

  if (raceDays === 0) {
    return `today's ${nextRace.title}`;
  }

  if (raceDays === 1) {
    return `tomorrow's ${nextRace.title}`;
  }

  return `${nextRace.title} in ${raceDays} days`;
}

function getStationRep(stationId: StationId, level: number) {
  const reps: Record<StationId, Record<number, { body: string; duration: string; intent: string; prompts: string[] }>> = {
    breathing: {
      1: {
        intent: "seated 4-in, 6-out breathing.",
        duration: "2 min",
        body: "Sit or stand still. Inhale for four, exhale for six. Count the exhale as the main rep and let the shoulders drop without trying to force calm.",
        prompts: ["Inhale 4", "Exhale 6", "Shoulders down"]
      },
      2: {
        intent: "longer-exhale regulation.",
        duration: "2 min",
        body: "Keep the inhale easy and make the exhale slightly longer. Let the breath find a repeatable rhythm you could use before a workout.",
        prompts: ["Easy inhale", "Long exhale", "Repeatable rhythm"]
      },
      3: {
        intent: "standing or walking regulation.",
        duration: "2 min",
        body: "Stand or walk slowly while keeping the exhale smooth. Practice staying regulated while the body is already moving toward training.",
        prompts: ["Stand tall", "Walk easy", "Smooth exhale"]
      },
      4: {
        intent: "compressed pre-race breathing.",
        duration: "90 sec",
        body: "Use two slow exhales, one cue word, and one first-action plan. This is the version that fits in a warm-up or line-call moment.",
        prompts: ["Two exhales", "Cue word", "First action"]
      }
    },
    attention: {
      1: {
        intent: "one attention anchor.",
        duration: "2 min",
        body: "Choose one anchor: breath, footfall, shoulders, horizon, or rhythm. When attention drifts, label it once and return.",
        prompts: ["One anchor", "Notice drift", "Return"]
      },
      2: {
        intent: "two-anchor switching.",
        duration: "2 min",
        body: "Switch on purpose between two anchors. Use one for calm and one for forward movement, then practice changing without drama.",
        prompts: ["Calm anchor", "Action anchor", "Switch cleanly"]
      },
      3: {
        intent: "breath to horizon to footfall focus shifting.",
        duration: "3 min",
        body: "Move through three anchors: breath, horizon, footfall or terrain. This trains flexible focus for cross country rhythm changes.",
        prompts: ["Breath", "Horizon", "Footfall"]
      },
      4: {
        intent: "race-integrated focus shifting.",
        duration: "2 min",
        body: "Compress the focus plan into warm-up or race language: breath, pack position, terrain, response. Keep it short enough to use under pressure.",
        prompts: ["Breath", "Position", "Respond"]
      }
    },
    selfTalk: {
      1: {
        intent: "one behavior-changing cue word.",
        duration: "2 min",
        body: "Pick one cue that changes behavior, not just mood. It should tell your body what to do: tall, smooth, patient, compact, brave.",
        prompts: ["Cue word", "Body action", "Say it clean"]
      },
      2: {
        intent: "early, middle, late cue ladder.",
        duration: "3 min",
        body: "Build a three-part cue ladder for the run: early control, middle composure, late commitment.",
        prompts: ["Early cue", "Middle cue", "Late cue"]
      },
      3: {
        intent: "adversity-specific cueing.",
        duration: "3 min",
        body: "Choose cues for one likely problem: flat legs, hills, contact, getting boxed, a surge, or comparison.",
        prompts: ["Problem", "Cue", "Next action"]
      },
      4: {
        intent: "compressed race cue script.",
        duration: "2 min",
        body: "Compress the full cue script into four beats you can remember while breathing hard.",
        prompts: ["Position", "Rhythm", "Respond", "Commit"]
      }
    },
    imagery: {
      1: {
        intent: "one static performance scene.",
        duration: "2 min",
        body: "Build one clear image: where you are, what your body is doing, and what calm readiness looks like.",
        prompts: ["Place", "Body", "Cue"]
      },
      2: {
        intent: "dynamic race or run imagery.",
        duration: "3 min",
        body: "Let the scene move. Feel rhythm, terrain, breath, and pack spacing while keeping the response controlled.",
        prompts: ["Rhythm", "Terrain", "Control"]
      },
      3: {
        intent: "imagery with an adversity branch.",
        duration: "3 min",
        body: "Add one problem to the scene. Watch yourself respond with the trained cue instead of surprise or panic.",
        prompts: ["Problem appears", "Settle", "Execute"]
      },
      4: {
        intent: "competition script with tactical choices.",
        duration: "3 min",
        body: "Run a compact competition script: start, position, one disruption, one tactical choice, and the commit point.",
        prompts: ["Start", "Choice", "Commit"]
      }
    },
    processGoals: {
      1: {
        intent: "one controllable process goal.",
        duration: "2 min",
        body: "Choose one behavior you can execute today regardless of how the legs feel.",
        prompts: ["One behavior", "Observable", "Controllable"]
      },
      2: {
        intent: "one process goal plus one if-then plan.",
        duration: "3 min",
        body: "Pair the process goal with one if-then plan for the most likely challenge in today's run.",
        prompts: ["Goal", "If", "Then"]
      },
      3: {
        intent: "layered if-then plans.",
        duration: "3 min",
        body: "Build two or three if-then plans for different race or run problems. Keep each response short enough to execute.",
        prompts: ["If boxed", "If flat", "If gapped"]
      },
      4: {
        intent: "goal and routine integration.",
        duration: "3 min",
        body: "Blend your process goal into the pre-performance routine so it becomes part of the script, not a separate thought.",
        prompts: ["Routine", "Goal", "First action"]
      }
    },
    routine: {
      1: {
        intent: "a three-step routine.",
        duration: "2 min",
        body: "Build the simplest useful routine: breath, cue, first action. Run it the same way twice.",
        prompts: ["Breath", "Cue", "First action"]
      },
      2: {
        intent: "warm-up transition rehearsal.",
        duration: "3 min",
        body: "Rehearse the bridge from warm-up to the real work: shoes or strides, breath, cue, first 30 seconds.",
        prompts: ["Warm-up", "Cue", "First 30"]
      },
      3: {
        intent: "adversity-ready routine.",
        duration: "3 min",
        body: "Attach the routine to one disruption: delay, nerves, bad first rep, contact, weather, or a messy start.",
        prompts: ["Disruption", "Routine", "Response"]
      },
      4: {
        intent: "race-day compressed routine.",
        duration: "2 min",
        body: "Compress the routine so it works when time is short: breathe, recall proof, cue, first-k plan.",
        prompts: ["Breathe", "Proof", "First-k plan"]
      }
    },
    reset: {
      1: {
        intent: "label and release.",
        duration: "2 min",
        body: "Name what is present without making it the whole story. Exhale, release the courtroom, and choose the next controllable.",
        prompts: ["Label", "Exhale", "Next controllable"]
      },
      2: {
        intent: "label, reframe, next action.",
        duration: "2 min",
        body: "Separate the facts from the interpretation. Then choose one useful behavior for the first part of today's run.",
        prompts: ["Facts", "Reframe", "Next action"]
      },
      3: {
        intent: "future response rehearsal.",
        duration: "3 min",
        body: "Rehearse the next similar moment before it happens. See the trigger, then see the cleaner response.",
        prompts: ["Trigger", "Cleaner response", "Carry it"]
      },
      4: {
        intent: "championship setback script.",
        duration: "2 min",
        body: "Compress the setback script: notice, settle, choose, commit. No spiral, no courtroom, no extra drama.",
        prompts: ["Notice", "Settle", "Choose", "Commit"]
      }
    }
  };

  return reps[stationId][level] ?? reps[stationId][1];
}

function getTransferAction(stationId: StationId, level: number) {
  const actions: Record<StationId, string[]> = {
    breathing: [
      "enter the first mile with a longer exhale and low shoulders.",
      "use the longer exhale before the first harder section.",
      "keep the breath smooth while walking, warming up, or rolling into pace.",
      "use two exhales, cue word, and first action when pressure is close."
    ],
    attention: [
      "return to one anchor when the mind wanders.",
      "switch between calm and action anchors as the run changes.",
      "move breath to horizon to footfall when terrain or pace shifts.",
      "compress focus into breath, position, terrain, and response."
    ],
    selfTalk: [
      "carry one behavior cue into the first mile.",
      "run the early, middle, late cue ladder.",
      "match the cue to the specific problem that shows up.",
      "use the compressed race script when decisions have to be fast."
    ],
    imagery: [
      "see one clean moment before you run it.",
      "feel the scene moving with rhythm and terrain.",
      "add a problem and rehearse the response.",
      "run the compact competition script with a tactical choice."
    ],
    processGoals: [
      "execute one observable behavior.",
      "pair the process goal with one if-then response.",
      "use layered if-then plans without overthinking.",
      "fold the goal into the routine and first action."
    ],
    routine: [
      "use breath, cue, and first action before starting.",
      "bridge warm-up into the first 30 seconds.",
      "repeat the routine if a disruption appears.",
      "compress routine, proof, cue, and first-k plan."
    ],
    reset: [
      "label the noise and return to the next controllable.",
      "separate facts from story and choose the first useful behavior.",
      "rehearse the trigger and cleaner response before it happens.",
      "use notice, settle, choose, commit under pressure."
    ]
  };

  return actions[stationId][Math.max(0, Math.min(3, level - 1))];
}

function getTransferPrompts(stationId: StationId, frame: PhaseFrame) {
  const prompts: Record<StationId, string[]> = {
    breathing: ["Exhale", "Lower shoulders", frame.prompts[0]],
    attention: ["Anchor", "Shift", frame.prompts[1]],
    selfTalk: ["Cue", "Behavior", frame.prompts[2]],
    imagery: ["See it", "Feel it", "Respond"],
    processGoals: ["Goal", "If-then", "First action"],
    routine: ["Breath", "Cue", "First action"],
    reset: ["Label", "Release", "Next controllable"]
  };

  return prompts[stationId];
}
