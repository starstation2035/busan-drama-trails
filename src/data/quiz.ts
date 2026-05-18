export type StyleKey = "healing" | "active" | "insta" | "kdrama";

export interface QuizOption {
  key: string;
  style: StyleKey;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  options: [QuizOption, QuizOption];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    options: [
      { key: "q1.a", style: "healing", icon: "🌅" },
      { key: "q1.b", style: "active", icon: "🛍️" },
    ],
  },
  {
    id: "q2",
    options: [
      { key: "q2.a", style: "insta", icon: "🎨" },
      { key: "q2.b", style: "kdrama", icon: "🎬" },
    ],
  },
  {
    id: "q3",
    options: [
      { key: "q3.a", style: "healing", icon: "☕" },
      { key: "q3.b", style: "active", icon: "🍢" },
    ],
  },
  {
    id: "q4",
    options: [
      { key: "q4.a", style: "insta", icon: "📷" },
      { key: "q4.b", style: "active", icon: "💥" },
    ],
  },
  {
    id: "q5",
    options: [
      { key: "q5.a", style: "kdrama", icon: "🎭" },
      { key: "q5.b", style: "insta", icon: "📐" },
    ],
  },
  {
    id: "q6",
    options: [
      { key: "q6.a", style: "healing", icon: "🍃" },
      { key: "q6.b", style: "active", icon: "⚡" },
    ],
  },
  {
    id: "q7",
    options: [
      { key: "q7.a", style: "kdrama", icon: "☔" },
      { key: "q7.b", style: "healing", icon: "🍵" },
    ],
  },
  {
    id: "q8",
    options: [
      { key: "q8.a", style: "insta", icon: "🏨" },
      { key: "q8.b", style: "kdrama", icon: "🏡" },
    ],
  },
  {
    id: "q9",
    options: [
      { key: "q9.a", style: "active", icon: "👟" },
      { key: "q9.b", style: "kdrama", icon: "🗺️" },
    ],
  },
  {
    id: "q10",
    options: [
      { key: "q10.a", style: "healing", icon: "🌿" },
      { key: "q10.b", style: "insta", icon: "🌃" },
    ],
  },
];

// Tie-breaker priority: kdrama > insta > healing > active
const PRIORITY: StyleKey[] = ["kdrama", "insta", "healing", "active"];

export function computeResult(answers: StyleKey[]): StyleKey {
  const counts: Record<StyleKey, number> = {
    healing: 0,
    active: 0,
    insta: 0,
    kdrama: 0,
  };
  for (const a of answers) counts[a]++;
  let best: StyleKey = "healing";
  let bestCount = -1;
  for (const k of PRIORITY) {
    if (counts[k] > bestCount) {
      best = k;
      bestCount = counts[k];
    }
  }
  return best;
}

export const STYLE_META: Record<
  StyleKey,
  {
    icon: string;
    colorVar: string;
    recommendedSpots: string[];
    recommendedRestaurants: string[];
    recommendedCafes: string[];
  }
> = {
  healing: {
    icon: "🌊",
    colorVar: "var(--gamcheon-mint)",
    recommendedSpots: ["spot_001", "spot_003"],
    recommendedRestaurants: ["r4"],
    recommendedCafes: ["c4"],
  },
  active: {
    icon: "🏃",
    colorVar: "var(--busan-coral)",
    recommendedSpots: ["spot_005"],
    recommendedRestaurants: ["r9"],
    recommendedCafes: ["c6"],
  },
  insta: {
    icon: "📸",
    colorVar: "var(--drama-yellow)",
    recommendedSpots: ["spot_004"],
    recommendedRestaurants: ["r12"],
    recommendedCafes: ["c5"],
  },
  kdrama: {
    icon: "🎬",
    colorVar: "var(--style-purple)",
    recommendedSpots: ["spot_004", "spot_001"],
    recommendedRestaurants: ["r5"],
    recommendedCafes: ["c12"],
  },
};

export const STYLE_KEYS = Object.keys(STYLE_META) as StyleKey[];
