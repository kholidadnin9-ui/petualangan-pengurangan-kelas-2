import { useState } from "react";
import { LEVELS } from "../data/levels";
import Leaf from "./Leaf";
import { sounds } from "../utils/sounds";

interface HomeScreenProps {
  onStart: () => void;
  onPickLevel: () => void;
  bestScores: Record<number, number>;
  unlockedLevel: number;
}

export default function HomeScreen({
  onStart,
  onPickLevel,
  bestScores,
}: HomeScreenProps) {
  const [muted, setMuted] = useState(sounds.isMuted());

  // count total stars across all levels
  const totalStars = LEVELS.reduce((acc, lv) => {
    const best = bestScores[lv.id] ?? 0;
    return acc + (best >= 9 ? 3 : best >= 7 ? 2 : best > 0 ? 1 : 0);
  }, 0);

  const toggleSound = () => {
    const next = sounds.toggleMute();
    setMuted(next);

    if (!next) {
      sounds.playClick();
    }
  };

  const handleStart = () => {
    sounds.playClick();
    onStart();
  };

  const handlePick = () => {
    sounds.playClick();
    onPickLevel();
  };

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center px-4 pb-8 pt-5">
      {/* Top greeting badge */}
      <div className="mb-3 flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-4 border-amber-700 bg-white/95 shadow-lg">
              <img
                src="/hero-characters.png"
                alt=""
                className="-mt-3 h-20 w-20 object-contain"
              />
            </div>
          </div>

          <div className="wood-plank px-4 py-2">
            <div className="text-xs leading-none opacity-90">
              Halo, Pejuang Hebat!
            </div>
            <div className="text-sm font-black leading-tight">
              Siap berpetualang?
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="circle-btn"
            style={{
              width: 44,
              height: 44,
              fontSize: "1.1rem",
            }}
            onClick={toggleSound}
            title={muted ? "Nyalakan Suara" : "Matikan Suara"}
            aria-label="Sound toggle"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Main wooden title sign with leaves */}
      <div className="relative mt-2 w-full max-w-xl px-4 py-2 fade-up">
        <Leaf className="leaf-deco leaf-tl" />
        <Leaf className="leaf-deco leaf-tr" />

        <div
          className="relative mx-auto w-full max-w-lg rounded-3xl p-5 text-center"
          style={{
            background:
              "linear-gradient(180deg, #d4934f 0%, #a66328 45%, #6b3615 100%)",
            boxShadow:
              "inset 0 4px 0 rgba(255,255,255,0.35), inset 0 -8px 0 rgba(0,0,0,0.3), 0 12px 0 rgba(0,0,0,0.25), 0 22px 40px rgba(0,0,0,0.3)",
            border: "3px solid #451a03",
          }}
        >
          <span className="wood-nail tl" />
          <span className="wood-nail tr" />
          <span className="wood-nail bl" />
          <span className="wood-nail br" />

          <h1 className="home-title">
            <span className="top">🌿 Petualangan 🌿</span>
            Pengurangan
          </h1>

          {/* CREATED BY TEXT UNDER TITLE */}
          <div className="my-1.5 inline-flex items-center gap-1.5 rounded-full bg-amber-950/50 px-3.5 py-0.5 shadow-inner">
            <span className="text-[11px] font-extrabold tracking-wide text-amber-200">
              Created by:{" "}
              <span className="text-white underline decoration-amber-300">
                Widodo guru sd
              </span>
            </span>
          </div>

          <p className="mt-1 text-sm font-bold text-amber-50 sm:text-base">
            Ayo selesaikan misi dan taklukkan semua level!
          </p>
        </div>
      </div>

      {/* Characters */}
      <div className="relative mt-3 flex w-full items-end justify-center">
        <img
          src="/hero-characters.png"
          alt="Petualang dan teman monyet"
          className="bob relative z-10 w-[270px] max-w-[68%] object-contain sm:w-[330px]"
          style={{
            filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.25))",
          }}
        />

        <img
          src="/monkey-happy.png"
          alt=""
          className="bob-slow absolute -right-2 bottom-0 z-0 w-24 object-contain sm:w-32"
          style={{
            filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.2))",
          }}
        />
      </div>

      {/* Info planks */}
      <div className="mt-3 flex w-full max-w-md flex-col gap-2">
        <InfoPlank
          icon="⭐"
          text={
            <>
              5 Level Seru · {totalStars} Bintang
            </>
          }
        />

        <InfoPlank
          icon="🏆"
          text={
            <>
              Belajar Sambil Bermain
            </>
          }
        />

        <InfoPlank
          icon="❤️"
          text={
            <>
              Jadi Lebih Hebat!
            </>
          }
        />
      </div>

      {/* Buttons */}
      <button
        type="button"
        onClick={handleStart}
        className="game-btn btn-yellow fade-up mt-5 w-full max-w-md px-8 py-3.5 text-2xl sm:text-3xl"
        style={{
          animationDelay: "0.1s",
        }}
      >
        <span className="text-3xl">▶</span> Mulai
      </button>

      <button
        type="button"
        onClick={handlePick}
        className="game-btn btn-orange fade-up mt-2.5 w-full max-w-md px-6 py-2.5 text-lg"
        style={{
          animationDelay: "0.15s",
        }}
      >
        🗺️ Pilih Level
      </button>

      <p className="mt-3 text-center text-xs font-bold text-emerald-950/70 drop-shadow-sm">
        Kelas 2 SD · Pengurangan 1–50
      </p>
    </div>
  );
}

function InfoPlank({
  icon,
  text,
}: {
  icon: string;
  text: React.ReactNode;
}) {
  return (
    <div
      className="relative mx-auto w-full max-w-xs rounded-2xl py-2 pl-12 pr-4 text-center text-white shadow-lg"
      style={{
        background:
          "linear-gradient(180deg, #c68642 0%, #9a5a25 50%, #6b3615 100%)",
        boxShadow:
          "inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -4px 0 rgba(0,0,0,0.25), 0 5px 0 rgba(0,0,0,0.2), 0 10px 18px rgba(0,0,0,0.2)",
      }}
    >
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl drop-shadow">
        {icon}
      </span>

      <span className="font-extrabold text-sm sm:text-base">
        {text}
      </span>
    </div>
  );
}
