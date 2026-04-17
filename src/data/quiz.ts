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
  { icon: string; colorVar: string; recommendedSpotIds: string[] }
> = {
  healing: {
    icon: "🌊",
    colorVar: "var(--gamcheon-mint)",
    recommendedSpotIds: ["spot_001", "spot_003", "spot_004"],
  },
  active: {
    icon: "🏃",
    colorVar: "var(--busan-coral)",
    recommendedSpotIds: ["spot_005", "spot_002", "spot_003"],
  },
  insta: {
    icon: "📸",
    colorVar: "var(--drama-yellow)",
    recommendedSpotIds: ["spot_002", "spot_004", "spot_001"],
  },
  kdrama: {
    icon: "🎬",
    colorVar: "var(--style-purple)",
    recommendedSpotIds: ["spot_001", "spot_004", "spot_005"],
  },
};
