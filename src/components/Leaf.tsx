interface LeafProps {
  className?: string;
  rotate?: number;
  flip?: boolean;
  color?: string;
}

export default function Leaf({ className = "", rotate = 0, flip = false, color = "#16a34a" }: LeafProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 80"
      style={{
        transform: `rotate(${rotate}deg)${flip ? " scaleX(-1)" : ""}`,
      }}
    >
      <defs>
        <linearGradient id={`leaf-grad-${color.replace("#", "")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
      </defs>
      <path
        d="M10 55 C 20 10, 80 -5, 130 25 C 120 60, 70 75, 20 70 Z"
        fill={`url(#leaf-grad-${color.replace("#", "")})`}
        stroke="#14532d"
        strokeWidth="3"
      />
      <path
        d="M20 60 C 45 50, 85 40, 125 30"
        stroke="#14532d"
        strokeWidth="2.5"
        fill="none"
      />
      <path d="M35 55 L45 42" stroke="#14532d" strokeWidth="2" fill="none" />
      <path d="M55 52 L65 38" stroke="#14532d" strokeWidth="2" fill="none" />
      <path d="M75 48 L85 35" stroke="#14532d" strokeWidth="2" fill="none" />
      <path d="M95 43 L105 32" stroke="#14532d" strokeWidth="2" fill="none" />
    </svg>
  );
}
