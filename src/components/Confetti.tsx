import { useMemo } from "react";

const COLORS = ["#fbbf24", "#22c55e", "#0ea5e9", "#ec4899", "#a855f7", "#f97316", "#ef4444"];

export default function Confetti({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 1.2}s`,
        duration: `${2.2 + Math.random() * 1.6}s`,
        color: COLORS[i % COLORS.length],
        rot: Math.random() * 360,
      })),
    []
  );
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            background: p.color,
            transform: `rotate(${p.rot}deg)`,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
