import { LEVELS } from "../data/levels";
import Leaf from "./Leaf";
import { sounds } from "../utils/sounds";

interface LevelSelectScreenProps {
  onPick: (id: number) => void;
  onBack: () => void;
  bestScores: Record<number, number>;
  unlockedLevel: number;
}

export default function LevelSelectScreen({ onPick, onBack, bestScores, unlockedLevel }: LevelSelectScreenProps) {
  const handleBack = () => {
    sounds.playClick();
    onBack();
  };

  const handlePick = (id: number) => {
    sounds.playClick();
    onPick(id);
  };

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-10 pt-5">
      {/* Top bar */}
      <div className="mb-3 flex items-center justify-between">
        <button className="circle-btn" onClick={handleBack} aria-label="Kembali">
          ←
        </button>
        <div className="relative">
          <Leaf className="absolute -left-8 top-1/2 w-14 -translate-y-1/2 -rotate-12" />
          <Leaf className="absolute -right-8 top-1/2 w-14 -translate-y-1/2 rotate-12" flip />
          <div
            className="wood-sign relative px-10 py-2 text-2xl sm:text-3xl"
            style={{ fontSize: "clamp(1.5rem, 5vw, 2.25rem)" }}
          >
            Pilih Level
          </div>
        </div>
        <div className="w-[54px]" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 place-items-center sm:grid-cols-2 md:grid-cols-3">
        {LEVELS.map((lv) => {
          const locked = lv.id > unlockedLevel;
          const best = bestScores[lv.id] ?? 0;
          const starsEarned = best >= 9 ? 3 : best >= 7 ? 2 : best > 0 ? 1 : 0;
          return (
            <button
              key={lv.id}
              type="button"
              disabled={locked}
              onClick={() => handlePick(lv.id)}
              className={`island ${locked ? "locked" : ""}`}
            >
              {/* Decorative trees on top depending on level */}
              <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 items-end gap-1">
                {lv.id === 1 && (
                  <>
                    <span className="text-3xl">🌳</span>
                    <span className="text-4xl">🌳</span>
                    <span className="text-3xl">🌳</span>
                  </>
                )}
                {lv.id === 2 && <span className="text-4xl">🏝️</span>}
                {lv.id === 3 && <span className="text-4xl">🗿</span>}
                {lv.id === 4 && <span className="text-4xl">🏔️</span>}
                {lv.id === 5 && <span className="text-4xl">🏰</span>}
              </div>

              <div className="relative mt-8">
                <div className="island-badge">{locked ? "🔒" : lv.id}</div>
                <div
                  className="island-top"
                  style={{
                    background: `linear-gradient(180deg, ${lv.topColor} 0%, ${lv.midColor} 100%)`,
                  }}
                >
                  <span className="island-emoji">{locked ? "🔒" : lv.emoji}</span>
                </div>
                <div className="island-dirt" />
                <div
                  className="mx-auto -mt-6 w-40 rounded-xl py-1 text-center font-black text-white shadow-md"
                  style={{
                    background: `linear-gradient(180deg, ${lv.midColor}, ${lv.buttonBorder})`,
                    textShadow: "0 2px 0 rgba(0,0,0,0.35)",
                  }}
                >
                  {lv.name}
                </div>
                <div className="island-stars mt-1 justify-center">
                  {[1, 2, 3].map((n) => (
                    <span key={n} className={n <= starsEarned ? "" : "opacity-30 grayscale"}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleBack}
        className="game-btn btn-blue mx-auto mt-10 px-6 py-2.5 text-base"
      >
        🏠 Kembali ke Beranda
      </button>
    </div>
  );
}
