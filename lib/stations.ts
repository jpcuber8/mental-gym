import type { SessionPlan, Station, StationId } from "@/types/mental-gym";

export const stations: Station[] = [
  {
    id: "breathing",
    title: "Breathing",
    shortTitle: "Breath",
    description: "Arousal regulation for the minutes before a run, workout, race, or travel-adjusted training day.",
    levels: [
      {
        level: 1,
        title: "Seated 4-in / 6-out",
        description: "Slow, seated breathing with a longer exhale.",
        example: "Nine breaths before an easy run or before bed."
      },
      {
        level: 2,
        title: "Longer Exhale",
        description: "A quieter rhythm with extended exhales or resonance-like pacing.",
        example: "Use it before the next run when yesterday's effort is still buzzing in the body."
      },
      {
        level: 3,
        title: "Standing / Walking",
        description: "Keep the breath smooth while standing, walking, or moving into warm-up.",
        example: "Walk to the start area and let the exhale keep your shoulders low."
      },
      {
        level: 4,
        title: "Pre-race Routine Breath",
        description: "A compressed breath pattern that fits inside your race routine.",
        example: "Two slow exhales before the line call-up, then cue word and first-k plan."
      }
    ],
    examples: ["Pre-run calm", "Race-morning nerves", "Travel-day warm-up", "Workout composure"]
  },
  {
    id: "attention",
    title: "Attention",
    shortTitle: "Focus",
    description: "Flexible focus shifting between breath, terrain, pack, rhythm, and effort cues.",
    levels: [
      {
        level: 1,
        title: "Single Anchor",
        description: "Choose one anchor and return to it every time attention drifts.",
        example: "Breath, footfall, shoulders, horizon, or the sound of rhythm."
      },
      {
        level: 2,
        title: "Two-anchor Switching",
        description: "Switch between two anchors on purpose.",
        example: "Breath for calm, then horizon for forward movement."
      },
      {
        level: 3,
        title: "Breath -> Horizon -> Footfall",
        description: "Move through a three-anchor ladder that fits cross country rhythm.",
        example: "Use it on rolling terrain when the pace gets uneven."
      },
      {
        level: 4,
        title: "Race-integrated Focus",
        description: "Shift focus during warm-up or race rehearsal without needing a long script.",
        example: "Line call-up: breath, pack position, first kilometer patience."
      }
    ],
    examples: ["Pack running", "Getting boxed in", "First kilometer patience", "Surges and terrain changes"]
  },
  {
    id: "selfTalk",
    title: "Self-talk",
    shortTitle: "Cues",
    description: "Motivational cue systems for effort, adversity, and late-race commitment.",
    levels: [
      {
        level: 1,
        title: "One Cue Word",
        description: "Pick one cue that changes behavior, not just mood.",
        example: "Smooth, tall, patient, brave, rhythm."
      },
      {
        level: 2,
        title: "Cue Ladder",
        description: "Choose cues for early, middle, and late effort.",
        example: "Tall and smooth -> stay brave -> one more gear."
      },
      {
        level: 3,
        title: "Adversity-specific Cues",
        description: "Prepare cues for flat legs, hills, surges, and contact.",
        example: "If boxed in: settle, breathe, find daylight."
      },
      {
        level: 4,
        title: "Compressed Race Script",
        description: "A tight cue script for championship weeks.",
        example: "Position. Rhythm. Respond. Commit."
      }
    ],
    examples: ["Discomfort in intervals", "Closing hard", "Hills", "First-rep composure"]
  },
  {
    id: "imagery",
    title: "Imagery",
    shortTitle: "Imagery",
    description: "Race-scenario rehearsal for tactical choices, composure, and confidence recall.",
    levels: [
      {
        level: 1,
        title: "Static Scene",
        description: "Build a clear image of one course moment.",
        example: "Standing calm on the line before the first kilometer."
      },
      {
        level: 2,
        title: "Dynamic Scene",
        description: "Let the scene move with rhythm, terrain, and body sensations.",
        example: "Rolling through a hill and cresting without panic."
      },
      {
        level: 3,
        title: "Adversity Branch",
        description: "Add a problem and rehearse the response.",
        example: "A surge hits at the worst moment and you return to rhythm."
      },
      {
        level: 4,
        title: "Competition Script",
        description: "Rehearse a full race segment with tactical choices.",
        example: "Start, pack position, hill response, final kilometer commitment."
      }
    ],
    examples: ["Nuttycombe prep", "Championship pack running", "Muddy patch or hill", "Confidence recall"]
  },
  {
    id: "processGoals",
    title: "Process Goals",
    shortTitle: "Plans",
    description: "Behavior-first goals and if-then plans that transfer into runs and races.",
    levels: [
      {
        level: 1,
        title: "One Process Goal",
        description: "Choose one controllable behavior for the next run.",
        example: "Return to rhythm within five seconds of any surge."
      },
      {
        level: 2,
        title: "Goal + If-then",
        description: "Pair the behavior with one response plan.",
        example: "If I feel flat early, then I relax my jaw and run the cue."
      },
      {
        level: 3,
        title: "Layered If-then Plans",
        description: "Prepare two or three plans for different race problems.",
        example: "If boxed, settle. If gapped, breathe and bridge. If hurting, shorten focus."
      },
      {
        level: 4,
        title: "Race-day Integration",
        description: "Blend process goals into the pre-performance routine.",
        example: "Routine, first-k patience, hill response, final-k commitment."
      }
    ],
    examples: ["Workout transfer", "Race morning controllables", "Altitude camp adaptation", "Transition support"]
  },
  {
    id: "routine",
    title: "Routine Rehearsal",
    shortTitle: "Routine",
    description: "Stable pre-performance scripts that compress well near races.",
    levels: [
      {
        level: 1,
        title: "Three-step Routine",
        description: "Build a simple breath, cue, action sequence.",
        example: "Steady breath -> cue word -> first 30 seconds plan."
      },
      {
        level: 2,
        title: "Warm-up Transition",
        description: "Practice the bridge from warm-up to start line.",
        example: "Shoes, strides, breath, cue, patience."
      },
      {
        level: 3,
        title: "Adversity-ready Routine",
        description: "Attach the routine to one likely disruption.",
        example: "If delayed, repeat breath and cue instead of spending nervous energy."
      },
      {
        level: 4,
        title: "Race-day Compressed",
        description: "A 2-5 minute routine for race day only.",
        example: "Breathe, recall, cue, first-k plan."
      }
    ],
    examples: ["Meet-eve routine", "Race-day compressed routine", "Line call-up", "No novelty week"]
  },
  {
    id: "reset",
    title: "Reset / Refocus",
    shortTitle: "Reset",
    description: "Pre-run reset protocols that clear residue from bad workouts, bad races, travel stress, or transition strain.",
    levels: [
      {
        level: 1,
        title: "Label and Release",
        description: "Name what you are carrying before the run without letting it become the whole story.",
        example: "Yesterday was rough. Exhale. Today's first controllable."
      },
      {
        level: 2,
        title: "Label, Reframe, Next Action",
        description: "Separate facts from interpretation and choose the next behavior for today's run.",
        example: "Flat legs are information. Posture and rhythm are the response."
      },
      {
        level: 3,
        title: "Future Response Rehearsal",
        description: "Rehearse the next similar moment before it shows up again.",
        example: "Next time the workout bites early, I relax my jaw and stay compact."
      },
      {
        level: 4,
        title: "Championship Setback Script",
        description: "A short response for high-stakes disruptions.",
        example: "Contact, mud, gap, or surge: settle, choose, commit."
      }
    ],
    examples: ["Next-run reset", "Travel stress", "Summer-to-UCLA transition", "Race-week composure"]
  }
];

export function getStation(stationId: StationId) {
  return stations.find((station) => station.id === stationId) ?? stations[0];
}

type ScriptPreset = Omit<SessionPlan, "id" | "stationId" | "level" | "mode" | "whyToday"> & {
  stationId: StationId;
};

export const scriptPresets: Record<string, ScriptPreset> = {
  baseFocus: {
    title: "Base-Day Focus Session",
    stationId: "attention",
    durationMinutes: 6,
    intent: "Use before the run to rehearse calm reorientation and a low-drama response to pace changes.",
    transferContext: "Your next run: rolling course, small surge, shoulders relaxed, rhythm found again.",
    steps: {
      regulation: {
        label: "Regulation Primer",
        duration: "90 sec",
        body: "Before you head out, breathe in for four seconds and out for six. Let the exhale drop your shoulders instead of chasing a perfect calm.",
        prompts: ["Inhale 4", "Exhale 6", "Nine steady breaths"]
      },
      primary: {
        label: "Primary Skill Rep",
        duration: "2 min",
        body: "Run the attention ladder: breath, horizon, footfall. When attention drifts, silently label it back and return to the next anchor.",
        prompts: ["Breath", "Horizon", "Footfall sound"]
      },
      transfer: {
        label: "XC Transfer Rep",
        duration: "90 sec",
        body: "Picture today's run hitting a rolling section where a small surge or pace change shows up. Your job is not to panic. Relax shoulders, lock to rhythm, and return within five seconds.",
        prompts: ["Notice the surge", "Relax shoulders", "Return to rhythm"]
      }
    }
  },
  discomfort: {
    title: "Workout-Day Discomfort Session",
    stationId: "selfTalk",
    durationMinutes: 7,
    intent: "Use before the workout to prepare a cue ladder for the moment it starts to bite.",
    transferContext: "Today's intervals or threshold work, where the first wave of discomfort may arrive early.",
    steps: {
      regulation: {
        label: "Regulation Primer",
        duration: "75 sec",
        body: "Take five slow breaths with a slightly longer exhale. Let the breath create space before today's workout asks for more.",
        prompts: ["Breathe low", "Longer exhale", "Let the jaw soften"]
      },
      primary: {
        label: "Primary Skill Rep",
        duration: "3 min",
        body: "Build a cue ladder: one cue for the first rep, one for the hard middle, and one for the finish.",
        prompts: ["Early: tall and smooth", "Middle: stay brave", "Finish: one more gear"]
      },
      transfer: {
        label: "XC Transfer Rep",
        duration: "90 sec",
        body: "Preview the moment discomfort rises in today's session. Instead of negotiating with it, run the cue and feel your form stay compact.",
        prompts: ["Flat early? Relax jaw", "Hard middle? Run the cue", "Late? Commit to form"]
      }
    }
  },
  meetEve: {
    title: "Meet-Eve Routine",
    stationId: "routine",
    durationMinutes: 8,
    intent: "Use before bed or pre-run to downshift while locking in a simple race routine.",
    transferContext: "The next race: nerves, course images, and a steady first-k plan.",
    steps: {
      regulation: {
        label: "Regulation Primer",
        duration: "90 sec",
        body: "Downshift with quiet breathing. Anxiety and excitement can both be present without needing to be solved.",
        prompts: ["Long exhale", "Heavy shoulders", "Clear next step"]
      },
      primary: {
        label: "Primary Skill Rep",
        duration: "3 min",
        body: "Rehearse a three-step routine: steady breath, cue word, first 30 seconds plan.",
        prompts: ["Breath", "Cue word", "First 30 seconds"]
      },
      transfer: {
        label: "XC Transfer Rep",
        duration: "2 min",
        body: "Visualize a clean start, one messy patch, one hill, and one surge. Each time, respond with position, rhythm, and patience.",
        prompts: ["Clean start", "Messy patch", "Controlled response"]
      }
    }
  },
  raceDay: {
    title: "Race-Day Compressed Routine",
    stationId: "routine",
    durationMinutes: 3,
    intent: "Use right before warm-up or call-up: no new skills, just calm confidence and the first action.",
    transferContext: "Today's start line: clarity with controlled aggression.",
    steps: {
      regulation: {
        label: "Regulation Primer",
        duration: "45 sec",
        body: "Two slow exhales. Let the body be ready without arguing with nerves.",
        prompts: ["Exhale", "Shoulders low", "Eyes forward"]
      },
      primary: {
        label: "Primary Skill Rep",
        duration: "60 sec",
        body: "Recall one workout, one race, and one hard moment you handled. You have receipts.",
        prompts: ["Workout proof", "Race proof", "Adversity proof"]
      },
      transfer: {
        label: "XC Transfer Rep",
        duration: "60 sec",
        body: "Compress the race script: position, rhythm, respond, commit. First kilometer patience, last kilometer courage.",
        prompts: ["Position", "Rhythm", "Respond", "Commit"]
      }
    }
  },
  nextRunReset: {
    title: "Pre-Run Reset",
    stationId: "reset",
    durationMinutes: 5,
    intent: "Use before the run to clear leftover noise and choose one clean first rep.",
    transferContext: "Today's run after a hard workout, rough rep, travel day, stressful transition, or messy headspace.",
    steps: {
      regulation: {
        label: "Regulation Primer",
        duration: "60 sec",
        body: "Name what you are carrying into today's run without judgment. It might be a bad rep, travel stress, comparison, or just noise. Then take slow breaths until the body is less ready to debate the story.",
        prompts: ["Name it plainly", "Exhale", "No courtroom"]
      },
      primary: {
        label: "Primary Skill Rep",
        duration: "2 min",
        body: "Three-part reset: what is present, what is controllable now, and what is the first useful action today?",
        prompts: ["Facts", "Controllables now", "First action today"]
      },
      transfer: {
        label: "XC Transfer Rep",
        duration: "90 sec",
        body: "Preview the next similar moment before you run. The goal is not to feel perfect. The goal is to enter today's run with a cleaner response ready.",
        prompts: ["Same moment", "Cleaner cue", "Today's action"]
      }
    }
  },
  travelReset: {
    title: "Travel-Day Reset",
    stationId: "breathing",
    durationMinutes: 4,
    intent: "Use before the travel-day run, walk, or mobility block to protect consistency without forcing normal-day standards.",
    transferContext: "Today's travel context: airports, time shifts, disrupted sleep, and flexible routine.",
    steps: {
      regulation: {
        label: "Regulation Primer",
        duration: "90 sec",
        body: "Breathe in four, out six. Let this count as the pre-run rep. Travel days get shorter standards.",
        prompts: ["Inhale 4", "Exhale 6", "Enough for today"]
      },
      primary: {
        label: "Primary Skill Rep",
        duration: "90 sec",
        body: "Choose one stable anchor for the day: hydration, mobility, sleep downshift, or a short walk.",
        prompts: ["One anchor", "Low friction", "No perfection tax"]
      },
      transfer: {
        label: "XC Transfer Rep",
        duration: "60 sec",
        body: "Picture arriving and doing the next small controllable before training. You are still a runner when the routine is imperfect.",
        prompts: ["Arrive", "Settle", "Next controllable"]
      }
    }
  },
  transitionGrounding: {
    title: "Transition-to-Campus Grounding",
    stationId: "processGoals",
    durationMinutes: 6,
    intent: "Use before the run to make the UCLA reporting transition concrete, grounded, and low-drama.",
    transferContext: "Today's team environment: first meetings, comparison pressure, new rhythm, and a steady run.",
    steps: {
      regulation: {
        label: "Regulation Primer",
        duration: "75 sec",
        body: "Slow breath. Notice the room, the feet, and the next hour. You only have to live the next controllable block.",
        prompts: ["Feet", "Room", "Next hour"]
      },
      primary: {
        label: "Primary Skill Rep",
        duration: "2 min",
        body: "Name three controllables for the transition: one body action, one social action, and one training action.",
        prompts: ["Body", "Social", "Training"]
      },
      transfer: {
        label: "XC Transfer Rep",
        duration: "2 min",
        body: "Rehearse walking into the team environment and then into the run with a stable cue: learn, settle, contribute. No need to solve the whole season today.",
        prompts: ["Learn", "Settle", "Contribute"]
      }
    }
  },
  altitudePatience: {
    title: "Altitude Camp Patience",
    stationId: "processGoals",
    durationMinutes: 6,
    intent: "Use before the run to rehearse patience and composure while the body adapts.",
    transferContext: "Today's Big Bear run: altitude, group rhythm, humility, and confidence without forcing.",
    steps: {
      regulation: {
        label: "Regulation Primer",
        duration: "75 sec",
        body: "Let the breath be easy rather than impressive. Altitude rewards patience more than force.",
        prompts: ["Easy breath", "Low shoulders", "No forcing"]
      },
      primary: {
        label: "Primary Skill Rep",
        duration: "2 min",
        body: "Create a control-what-you-can plan: effort honesty, recovery habits, group composure, and one cue for rough patches.",
        prompts: ["Effort honesty", "Recovery", "Group composure"]
      },
      transfer: {
        label: "XC Transfer Rep",
        duration: "2 min",
        body: "Imagine today's run starting with strange legs. You choose humility, rhythm, and the next controllable instead of comparison.",
        prompts: ["Strange legs", "Humility", "Rhythm"]
      }
    }
  },
  championshipConfidence: {
    title: "Championship-Week Confidence",
    stationId: "imagery",
    durationMinutes: 5,
    intent: "Use before the run or warm-up for specific confidence, not hype, while keeping novelty low.",
    transferContext: "Today's championship-week rep: tactical patience and controlled aggression.",
    steps: {
      regulation: {
        label: "Regulation Primer",
        duration: "60 sec",
        body: "Slow breathing. Let confidence feel quiet and specific.",
        prompts: ["Long exhale", "Quiet confidence", "Clear eyes"]
      },
      primary: {
        label: "Primary Skill Rep",
        duration: "2 min",
        body: "Recall one proof of fitness, one proof of toughness, and one proof of tactical patience.",
        prompts: ["Fitness proof", "Toughness proof", "Patience proof"]
      },
      transfer: {
        label: "XC Transfer Rep",
        duration: "90 sec",
        body: "Visualize today's run or race asking a question: surge, hill, contact, gap. Your answer is simple: settle, choose, commit.",
        prompts: ["Settle", "Choose", "Commit"]
      }
    }
  },
  maintenance: {
    title: "Three-Minute Maintenance Rep",
    stationId: "breathing",
    durationMinutes: 3,
    intent: "Use before the run to protect the habit when the week is thin. Minimum effective dose.",
    transferContext: "Today's small pre-run rep that keeps the room open.",
    steps: {
      regulation: {
        label: "Regulation Primer",
        duration: "60 sec",
        body: "Four in, six out. Count six breaths. This is enough to maintain the thread.",
        prompts: ["Inhale 4", "Exhale 6", "No guilt"]
      },
      primary: {
        label: "Primary Skill Rep",
        duration: "60 sec",
        body: "Choose one cue for today's run, walk, lift, or recovery choice.",
        prompts: ["One cue", "One action", "Done cleanly"]
      },
      transfer: {
        label: "XC Transfer Rep",
        duration: "45 sec",
        body: "Picture using that cue once. One clean transfer beats a missed perfect session.",
        prompts: ["See it once", "Carry it out", "Move on"]
      }
    }
  }
};
