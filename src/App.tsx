import { useCallback, useEffect, useMemo, useState } from "react";
import { LEVELS, generateQuestions, Question } from "./data/levels";
import JungleScene from "./components/JungleScene";
import HomeScreen from "./components/HomeScreen";
import LevelSelectScreen from "./components/LevelSelectScreen";
import GameScreen from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";

type Screen = "home" | "levels" | "play" | "result";

const STORAGE_KEY = "hutan-pengurangan-v2";

interface SavedProgress {
  unlockedLevel: number;
  bestScores: Record<number, number>;
}

function loadProgress(): SavedProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SavedProgress;
      return {
        unlockedLevel: Math.min(5, Math.max(1, parsed.unlockedLevel ?? 1)),
        bestScores: parsed.bestScores ?? {},
      };
    }
  } catch {
    /* ignore */
  }
  return { unlockedLevel: 1, bestScores: {} };
}

function saveProgress(p: SavedProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [levelId, setLevelId] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [finalComplete, setFinalComplete] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setUnlockedLevel(p.unlockedLevel);
    setBestScores(p.bestScores);
  }, []);

  const level = useMemo(
    () => LEVELS.find((l) => l.id === levelId) ?? LEVELS[0],
    [levelId]
  );

  const startLevel = useCallback((id: number) => {
    const lv = LEVELS.find((l) => l.id === id) ?? LEVELS[0];
    setLevelId(id);
    setQuestions(generateQuestions(lv, 10));
    setScore(0);
    setAnswers([]);
    setJustUnlocked(false);
    setFinalComplete(false);
    setScreen("play");
  }, []);

  const handleStartFromHome = useCallback(() => {
    // start at highest unlocked level (or level 1)
    startLevel(unlockedLevel);
  }, [startLevel, unlockedLevel]);

  const handleFinish = useCallback(
    (finalScore: number, finalAnswers: boolean[]) => {
      setScore(finalScore);
      setAnswers(finalAnswers);
      setJustUnlocked(false);

      const prevBest = bestScores[levelId] ?? 0;
      const nextBest = { ...bestScores, [levelId]: Math.max(prevBest, finalScore) };
      setBestScores(nextBest);

      let nextUnlocked = unlockedLevel;
      if (finalScore >= 6 && levelId < 5) {
        const candidate = levelId + 1;
        if (candidate > unlockedLevel) {
          nextUnlocked = candidate;
          setJustUnlocked(true);
        }
      }
      setUnlockedLevel(nextUnlocked);
      saveProgress({ unlockedLevel: nextUnlocked, bestScores: nextBest });

      if (levelId === 5 && finalScore >= 6) {
        setFinalComplete(true);
      }

      setScreen("result");
    },
    [bestScores, levelId, unlockedLevel]
  );

  const handleNextLevel = () => {
    if (levelId < 5) startLevel(levelId + 1);
  };

  return (
    <div className="relative min-h-screen font-[Nunito,sans-serif]">
      <JungleScene />

      {screen === "home" && (
        <HomeScreen
          onStart={handleStartFromHome}
          onPickLevel={() => setScreen("levels")}
          bestScores={bestScores}
          unlockedLevel={unlockedLevel}
        />
      )}

      {screen === "levels" && (
        <LevelSelectScreen
          onPick={startLevel}
          onBack={() => setScreen("home")}
          bestScores={bestScores}
          unlockedLevel={unlockedLevel}
        />
      )}

      {screen === "play" && questions.length > 0 && (
        <GameScreen
          level={level}
          questions={questions}
          onFinish={handleFinish}
          onQuit={() => setScreen("home")}
        />
      )}

      {screen === "result" && (
        <ResultScreen
          level={level}
          score={score}
          total={10}
          answers={answers}
          unlockedNext={justUnlocked}
          hasNext={levelId < 5}
          allLevelsComplete={finalComplete}
          onRetry={() => startLevel(levelId)}
          onHome={() => setScreen("home")}
          onNextLevel={handleNextLevel}
        />
      )}
    </div>
  );
}
