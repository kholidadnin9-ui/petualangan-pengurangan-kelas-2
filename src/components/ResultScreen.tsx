import { useEffect } from "react";
import { Level } from "../data/levels";
import Confetti from "./Confetti";
import Leaf from "./Leaf";
import { sounds } from "../utils/sounds";

interface ResultScreenProps {
  level: Level;
  score: number;
  total: number;
  answers: boolean[];
  unlockedNext: boolean;
  hasNext: boolean;
  allLevelsComplete?: boolean;
  onRetry: () => void;
  onHome: () => void;
  onNextLevel: () => void;
}

export default function ResultScreen({
  level,
  score,
  total,
  answers,
  unlockedNext,
  hasNext,
  allLevelsComplete,
  onRetry,
  onHome,
  onNextLevel,
}: ResultScreenProps) {
  const ratio = score / total;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0;

  const message =
    ratio >= 0.9
      ? "Luar biasa! Kamu jagoan pengurangan!"
      : ratio >= 0.7
        ? "Hebat! Terus berlatih ya!"
        : ratio >= 0.5
          ? "Bagus! Ayo coba lagi agar lebih jago!"
          : "Jangan menyerah! Coba lagi ya, petualang!";

  useEffect(() => {
    // Play triumphant level complete fanfare
    sounds.playLevelComplete();
  }, []);

  const handleNext = () => {
    sounds.playClick();
    onNextLevel();
  };

  const handleRetry = () => {
    sounds.playClick();
    onRetry();
  };

  const handleHome = () => {
    sounds.playClick();
    onHome();
  };

  if (allLevelsComplete) {
    return (
      <FinalWinScreen
        onRetry={handleRetry}
        onHome={handleHome}
        score={score}
      />
    );
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 py-8">
      <Confetti show={stars >= 2} />

      <div className="fade-up relative w-full">
        <Leaf
          className="absolute -left-6 -top-6 w-20"
          rotate={-15}
        />

        <Leaf
          className="absolute -right-6 -top-6 w-20"
          rotate={15}
          flip
        />

        <div
          className="mx-auto rounded-3xl p-6 text-center text-white sm:p-8"
          style={{
            background:
              "linear-gradient(180deg, #d4934f 0%, #a66328 50%, #6b3615 100%)",
            boxShadow:
              "inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -8px 0 rgba(0,0,0,0.3), 0 12px 0 rgba(0,0,0,0.25), 0 22px 40px rgba(0,0,0,0.3)",
            border: "4px solid #451a03",
          }}
        >
          <span className="wood-nail tl" />
          <span className="wood-nail tr" />
          <span className="wood-nail bl" />
          <span className="wood-nail br" />

          <p className="text-xs font-extrabold uppercase tracking-widest text-amber-100/90">
            Level {level.id} · {level.name}
          </p>

          <h2
            className="mt-1 text-3xl font-black sm:text-4xl"
            style={{
              textShadow: "0 3px 0 rgba(0,0,0,0.35)",
            }}
          >
            Selesai! 🎉
          </h2>

          {/* Parchment score card */}
          <div className="parchment mt-5 p-5">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`big-star ${n <= stars ? "" : "dim"}`}
                >
                  ⭐
                </span>
              ))}
            </div>

            <div className="mt-3 text-5xl font-black text-amber-900">
              {score}
              <span className="text-3xl">/{total}</span>
            </div>

            <p className="mt-1 text-sm font-bold text-amber-800">
              jawaban benar
            </p>

            <p className="mt-3 text-base font-extrabold text-amber-900">
              {message}
            </p>
          </div>

          {/* Answer dots */}
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {answers.map((ok, i) => (
              <span
                key={i}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black text-white shadow ${
                  ok ? "bg-emerald-400" : "bg-rose-400"
                }`}
                style={{
                  textShadow: "0 1px 0 rgba(0,0,0,0.3)",
                }}
              >
                {i + 1}
              </span>
            ))}
          </div>

          {unlockedNext && hasNext && (
            <div className="mt-4 rounded-full bg-amber-300 px-4 py-1.5 text-sm font-black text-amber-900 shadow">
              ✨ Level baru terbuka!
            </div>
          )}

          {/* Buttons */}
          <div className="mt-5 flex flex-col gap-3">
            {hasNext && score >= 6 && (
              <button
                className="game-btn btn-yellow w-full px-6 py-3 text-xl"
                onClick={handleNext}
              >
                Level Berikutnya →
              </button>
            )}

            <button
              className="game-btn btn-green w-full px-6 py-3 text-lg"
              onClick={handleRetry}
            >
              🔄 Main Lagi
            </button>

            <button
              className="game-btn btn-blue w-full px-6 py-3 text-lg"
              onClick={handleHome}
            >
              🏠 Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinalWinScreen({
  onRetry,
  onHome,
  score,
}: {
  onRetry: () => void;
  onHome: () => void;
  score: number;
}) {
  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 py-8">
      <Confetti show />

      <div className="fade-up relative w-full text-center">
        {/* Trophy image */}
        <img
          src="/castle-trophy.png"
          alt="Piala kemenangan"
          className="mx-auto w-56 object-contain drop-shadow-2xl sm:w-72"
        />

        <h2
          className="mt-2 text-4xl font-black sm:text-5xl"
          style={{
            background: "linear-gradient(180deg, #fde047, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 4px 0 rgba(0,0,0,0.15)",
            filter:
              "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
          }}
        >
          Selamat!
        </h2>

        <p
          className="mt-2 text-lg font-extrabold text-white drop-shadow"
          style={{
            textShadow: "0 2px 0 rgba(0,0,0,0.4)",
          }}
        >
          Kamu telah menyelesaikan semua level!
        </p>

        <div
          className="mt-5 rounded-3xl p-5 text-white"
          style={{
            background:
              "linear-gradient(180deg, #d4934f 0%, #a66328 50%, #6b3615 100%)",
            border: "4px solid #451a03",
            boxShadow:
              "inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -8px 0 rgba(0,0,0,0.3), 0 12px 0 rgba(0,0,0,0.25), 0 22px 40px rgba(0,0,0,0.3)",
          }}
        >
          <span className="wood-nail tl" />
          <span className="wood-nail tr" />
          <span className="wood-nail bl" />
          <span className="wood-nail br" />

          <p className="text-lg font-black">
            🏆 Kamu adalah
          </p>

          <p
            className="text-2xl font-black"
            style={{
              textShadow: "0 2px 0 rgba(0,0,0,0.35)",
            }}
          >
            Pahlawan Pengurangan!
          </p>

          <p className="mt-2 text-sm font-bold opacity-90">
            Skor terakhir: {score}/10
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <button
            className="game-btn btn-yellow w-full px-6 py-3 text-xl"
            onClick={onRetry}
          >
            🔁 Main Lagi
          </button>

          <button
            className="game-btn btn-blue w-full px-6 py-3 text-lg"
            onClick={onHome}
          >
            🏠 Menu
          </button>
        </div>
      </div>
    </div>
  );
}
