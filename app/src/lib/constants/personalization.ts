export const ASSESSMENT_TOTAL_STEPS = 5

export const SCORE_BANDS = {
  reinforcement: 0.45,
  standard: 0.7,
} as const

export const ADAPTATION_RULES = {
  reinforcement: {
    decisionType: "REINFORCEMENT",
    rationale: "Foundations need reinforcement before accelerating.",
  },
  acceleration: {
    decisionType: "ACCELERATION",
    rationale: "Strong baseline allows faster progression.",
  },
  styleSwitch: {
    decisionType: "STYLE_SWITCH",
    rationale: "Engagement signals suggest changing learning modality.",
  },
} as const
