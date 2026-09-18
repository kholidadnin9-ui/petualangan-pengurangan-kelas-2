import { useEffect, useMemo, useState } from "react";
import { Level, Question } from "../data/levels";
import { sounds } from "../utils/sounds";

interface GameScreenProps {
  level: Level;
  questions: Question[];
  onFinish: (score: number, answers: boolean[]) => void;
  onQuit: () => void;
}

const OPT_COLORS = [
  "opt-green",
  "opt-blue",
  "opt-orange",
  "opt-purple",
] as const;

export default function GameScreen({
  level,
  questions,
  onFinish,
  onQuit,
}: GameScreenProps) {
  const [index, setIndex] = useState(0);
  const [, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  const q = questions[index];
  const isLast = index === questions.length - 1;

  // Base URL untuk GitHub Pages / Vite
  const baseUrl = import.meta.env.BASE_URL;

  const monkeyPeekImage = `${baseUrl}monkey-peek.png`;
  const boyCheerImage = `${baseUrl}boy-cheer.png`;

  // Shuffle option colors per question
  const optionColors = useMemo(() => {
    const colors = [...OPT_COLORS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return colors;
  }, [index]);

  useEffect(() => {
    setSelected(null);
    setStatus("idle");
    setShowDialog(false);
  }, [index]);

  const encouragement = useMemo(() => {
    const msgs = [
      "Ayo, kamu pasti bisa!",
      "Semangat, petualang!",
      "Fokus ya, kamu hebat!",
      "Jangan menyerah!",
      "Kamu pintar, kok!",
      "Satu soal lagi, yuk!",
    ];

    return msgs[index % msgs.length];
  }, [index]);

  const handleSelect = (opt: number) => {
    if (status !== "idle") return;

    setSelected(opt);

    const correct = opt === q.answer;

    if (correct) {
      sounds.playCorrect();
      setStatus("correct");
      setScore((s) => s + 1);
      setAnswers((a) => [...a, true]);
    } else {
      sounds.playWrong();
      setStatus("wrong");
      setAnswers((a) => [...a, false]);
    }

    setShowDialog(true);
  };

  const goNext = () => {
    sounds.playClick();

    if (isLast) {
      const finalAnswers = [...answers];
      const finalScore = finalAnswers.filter(Boolean).length;

      onFinish(finalScore, finalAnswers);
      return;
    }

    setIndex((i) => i + 1);
  };

  const handleQuit = () => {
    sounds.playClick();
    onQuit();
  };

  const praisePhrases = [
    "Kamu hebat!",
    "Hebat sekali!",
    "Pintar!",
    "Luar biasa!",
    "Betul!",
    "Mantap!",
  ];

  const praise =
    praisePhrases[Math.floor(Math.random() * praisePhrases.length)];

  // Tampilkan titik jika angka pengurang tidak terlalu besar
  const showDots = q.minuend <= 20;

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 pb-6 pt-4">

      {/* Top bar */}
      <div className="flex items-center gap-2">

        <button
          className="circle-btn"
          style={{
            width: 48,
            height: 48,
            fontSize: "1.25rem",
          }}
          onClick={handleQuit}
          aria-label="Kembali"
        >
          ←
        </button>

        <div className="relative flex-1">
          <div className="wood-plank flex items-center justify-between gap-2 px-4 py-2">

            <span className="truncate">

              <span className="text-xs opacity-90">
                Level {level.id}
              </span>

              <span className="ml-2 font-black">
                {level.name}
              </span>

            </span>

          </div>
        </div>

        {/* Star + progress */}
        <div className="mini-stars">
          <span className="mstar">
            ⭐
          </span>

          <span>
            {index + 1}/{questions.length}
          </span>
        </div>

      </div>

      {/* Progress bar */}
      <div className="mt-3 flex items-center justify-center gap-1.5">

        {questions.map((_, i) => (
          <span
            key={i}
            className={`h-3 rounded-full transition-all ${
              i < index
                ? answers[i]
                  ? "w-5 bg-emerald-400"
                  : "w-5 bg-rose-400"
                : i === index
                  ? "w-8 bg-amber-400 ring-2 ring-amber-600/40"
                  : "w-3 bg-white/70"
            }`}
            style={{
              boxShadow:
                "0 2px 0 rgba(0,0,0,0.15)",
            }}
          />
        ))}

      </div>

      {/* Question board */}
      <div
        key={q.id}
        className="fade-up mt-4"
      >

        <div className="parchment mx-auto w-full max-w-xl text-center">

          <p className="text-sm font-extrabold uppercase tracking-wider text-amber-800">
            Berapa hasilnya?
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">

            <div className="equation-num">
              {q.minuend}
            </div>

            <div className="equation-op">
              −
            </div>

            <div className="equation-num">
              {q.subtrahend}
            </div>

            <div className="equation-op">
              =
            </div>

            <div
              className="equation-num"
              style={{
                background:
                  status === "correct"
                    ? "linear-gradient(180deg,#bbf7d0,#4ade80)"
                    : status === "wrong"
                      ? "linear-gradient(180deg,#fecdd3,#f87171)"
                      : "linear-gradient(180deg,#fff,#fef9c3)",

                color:
                  status === "idle"
                    ? "#b45309"
                    : "#7c2d12",

                borderStyle:
                  status === "idle"
                    ? "dashed"
                    : "solid",
              }}
            >
              {status === "idle"
                ? "?"
                : q.answer}
            </div>

          </div>

          {/* Visual subtraction dots */}
          {showDots && (
            <div className="mt-4 flex max-w-md flex-wrap items-center justify-center gap-1.5">

              {Array.from({
                length: q.minuend,
              }).map((_, i) => (

                <span
                  key={i}
                  className={`inline-block h-4 w-4 rounded-full border-2 ${
                    i < q.subtrahend
                      ? "border-rose-700 bg-rose-400 opacity-60"
                      : "border-emerald-700 bg-emerald-400"
                  }`}
                >

                  {i < q.subtrahend && (
                    <span className="flex h-full w-full items-center justify-center text-[10px] font-black text-rose-900">
                      ×
                    </span>
                  )}

                </span>

              ))}

            </div>
          )}

          {/* Answer options */}
          <div className="mt-6 grid grid-cols-3 gap-3">

            {q.options.map((opt, oi) => {

              let cls =
                `answer-block ${optionColors[oi]}`;

              if (status !== "idle") {

                if (opt === q.answer) {
                  cls += " correct";
                } else if (opt === selected) {
                  cls += " wrong";
                } else {
                  cls += " dimmed";
                }

              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={status !== "idle"}
                  onClick={() => handleSelect(opt)}
                  className={cls}
                >
                  {opt}
                </button>
              );

            })}

          </div>

        </div>

      </div>

      {/* Monkey encouragement */}
      <div className="relative mt-4 flex items-end justify-start">

        <img
          src={monkeyPeekImage}
          alt=""
          className="bob relative z-10 w-24 object-contain sm:w-28"
          style={{
            filter:
              "drop-shadow(0 6px 10px rgba(0,0,0,0.2))",
          }}
        />

        <div className="speech-bubble mb-6 ml-2 max-w-[220px] text-sm sm:text-base">
          {encouragement}
        </div>

      </div>

      {/* Feedback Dialog */}
      {showDialog && (

        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 p-4 backdrop-blur-sm sm:items-center">

          <div
            className="fade-up relative w-full max-w-md rounded-3xl p-6 pt-2 text-center"
            style={{
              background:
                status === "correct"
                  ? "linear-gradient(180deg, #86efac 0%, #22c55e 100%)"
                  : "linear-gradient(180deg, #fca5a5 0%, #ef4444 100%)",

              border: "6px solid #fff",

              boxShadow:
                "0 20px 40px rgba(0,0,0,0.35)",
            }}
          >

            {/* Boy cheering */}
            {status === "correct" && (

              <img
                src={boyCheerImage}
                alt=""
                className="mx-auto -mt-20 w-40 object-contain drop-shadow-xl sm:-mt-24 sm:w-48"
              />

            )}

            <div className="mb-2 text-5xl drop-shadow-lg sm:text-6xl">
              {status === "correct"
                ? "⭐"
                : "😅"}
            </div>

            <h2
              className="mb-1 text-4xl font-black text-white"
              style={{
                textShadow:
                  "0 3px 0 rgba(0,0,0,0.25)",
              }}
            >
              {status === "correct"
                ? "Hebat!"
                : "Ups, kurang tepat!"}
            </h2>

            <p
              className="mb-3 text-lg font-extrabold text-white"
              style={{
                textShadow:
                  "0 2px 0 rgba(0,0,0,0.2)",
              }}
            >
              {q.minuend} − {q.subtrahend} ={" "}

              <span className="text-amber-200">
                {q.answer}
              </span>

            </p>

            {status === "correct" ? (

              <p className="mb-4 font-bold text-emerald-50/90">
                {praise}
              </p>

            ) : (

              <p className="mb-4 font-bold text-rose-50/90">
                Jangan menyerah, coba perhatikan lagi ya!
              </p>

            )}

            <button
              type="button"
              onClick={goNext}
              className={`game-btn w-full px-8 py-3 text-xl ${
                status === "correct"
                  ? "btn-yellow"
                  : "btn-green"
              }`}
            >
              {isLast
                ? "Lihat Hasil 🏆"
                : "Lanjut →"}
            </button>

          </div>

        </div>

      )}

    </div>
  );
}
