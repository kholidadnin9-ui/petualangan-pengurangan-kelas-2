export interface Question {
  id: number;
  minuend: number;
  subtrahend: number;
  answer: number;
  options: number[];
}

export interface Level {
  id: number;
  name: string;
  subtitle: string;
  emoji: string;
  minRange: number;
  maxRange: number;
  // island / button colors
  topColor: string;
  midColor: string;
  bottomColor: string;
  ringColor: string; // number badge ring
  buttonBg: string; // answer button color
  buttonBorder: string;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Hutan Hijau",
    subtitle: "Level 1 · 1–10",
    emoji: "🌳",
    minRange: 1,
    maxRange: 10,
    topColor: "#86efac",
    midColor: "#4ade80",
    bottomColor: "#92400e",
    ringColor: "#a16207",
    buttonBg: "linear-gradient(180deg,#86efac,#22c55e)",
    buttonBorder: "#15803d",
  },
  {
    id: 2,
    name: "Sungai Ceria",
    subtitle: "Level 2 · 1–20",
    emoji: "🌊",
    minRange: 5,
    maxRange: 20,
    topColor: "#7dd3fc",
    midColor: "#0ea5e9",
    bottomColor: "#78350f",
    ringColor: "#a16207",
    buttonBg: "linear-gradient(180deg,#7dd3fc,#0284c7)",
    buttonBorder: "#075985",
  },
  {
    id: 3,
    name: "Gua Misteri",
    subtitle: "Level 3 · 10–30",
    emoji: "💎",
    minRange: 10,
    maxRange: 30,
    topColor: "#c4b5fd",
    midColor: "#8b5cf6",
    bottomColor: "#581c87",
    ringColor: "#a16207",
    buttonBg: "linear-gradient(180deg,#d8b4fe,#9333ea)",
    buttonBorder: "#6b21a8",
  },
  {
    id: 4,
    name: "Puncak Gunung",
    subtitle: "Level 4 · 15–40",
    emoji: "🏔️",
    minRange: 15,
    maxRange: 40,
    topColor: "#bae6fd",
    midColor: "#38bdf8",
    bottomColor: "#78350f",
    ringColor: "#b45309",
    buttonBg: "linear-gradient(180deg,#93c5fd,#2563eb)",
    buttonBorder: "#1e40af",
  },
  {
    id: 5,
    name: "Istana Harta",
    subtitle: "Level 5 · 20–50",
    emoji: "🏰",
    minRange: 20,
    maxRange: 50,
    topColor: "#fcd34d",
    midColor: "#f59e0b",
    bottomColor: "#7c2d12",
    ringColor: "#92400e",
    buttonBg: "linear-gradient(180deg,#fde68a,#f59e0b)",
    buttonBorder: "#b45309",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniqueWrongOptions(correct: number, count: number, max: number): number[] {
  const opts = new Set<number>();
  let attempts = 0;
  while (opts.size < count && attempts < 100) {
    attempts++;
    const offset = Math.floor(Math.random() * 7) - 3;
    let wrong = correct + offset;
    if (wrong === correct) wrong = correct + (Math.random() > 0.5 ? 1 : -1);
    if (wrong < 0) wrong = correct + Math.ceil(Math.random() * 4);
    if (wrong > max + 5) wrong = Math.max(0, correct - Math.ceil(Math.random() * 4));
    if (wrong !== correct && wrong >= 0) opts.add(wrong);
  }
  let n = 1;
  while (opts.size < count) {
    if (correct + n >= 0) opts.add(correct + n);
    if (opts.size < count && correct - n >= 0) opts.add(correct - n);
    n++;
  }
  return Array.from(opts).slice(0, count);
}

export function generateQuestions(level: Level, count = 10): Question[] {
  const questions: Question[] = [];
  const seen = new Set<string>();

  while (questions.length < count) {
    const maxM = level.maxRange;
    const minM = Math.max(level.minRange, 2);
    const minuend = Math.floor(Math.random() * (maxM - minM + 1)) + minM;
    const subtrahend = Math.floor(Math.random() * (minuend - 1)) + 1;
    const answer = minuend - subtrahend;
    const key = `${minuend}-${subtrahend}`;
    if (seen.has(key) || answer < 0) continue;
    seen.add(key);

    const wrongs = uniqueWrongOptions(answer, 2, level.maxRange);
    const options = shuffle([answer, ...wrongs]);

    questions.push({
      id: questions.length + 1,
      minuend,
      subtrahend,
      answer,
      options,
    });
  }

  return questions;
}
