import type { Station, StationId } from "@/types/mental-gym";

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
