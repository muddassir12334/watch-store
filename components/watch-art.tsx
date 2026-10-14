import { useId } from "react";
import type { WatchLook } from "@/lib/products";

// Drawn stand-in for product photography. Replace with real images once the
// business supplies them (ProductImage in the SRS data model).

const CX = 160;
const CY = 260;

function Hands({ color, seconds }: { color: string; seconds: string }) {
  return (
    <g strokeLinecap="round">
      <line x1={CX} y1={CY} x2={CX} y2={CY - 50} stroke={color} strokeWidth="6" transform={`rotate(-55 ${CX} ${CY})`} />
      <line x1={CX} y1={CY} x2={CX} y2={CY - 76} stroke={color} strokeWidth="4" transform={`rotate(62 ${CX} ${CY})`} />
      <line x1={CX} y1={CY + 18} x2={CX} y2={CY - 84} stroke={seconds} strokeWidth="1.5" transform={`rotate(205 ${CX} ${CY})`} />
      <circle cx={CX} cy={CY} r="6" fill={color} />
      <circle cx={CX} cy={CY} r="2" fill="#0b0c0f" />
    </g>
  );
}

function Indices({ color }: { color: string }) {
  return (
    <g stroke={color} strokeLinecap="round">
      {Array.from({ length: 60 }, (_, i) => {
        const hour = i % 5 === 0;
        return (
          <line
            key={i}
            x1={CX}
            y1={CY - 92}
            x2={CX}
            y2={CY - (hour ? 78 : 88)}
            strokeWidth={hour ? 3.5 : 1}
            opacity={hour ? 0.95 : 0.5}
            transform={`rotate(${i * 6} ${CX} ${CY})`}
          />
        );
      })}
    </g>
  );
}

function Subdial({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#000" opacity="0.28" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke={color} strokeWidth="2" strokeDasharray="1 5" opacity="0.7" />
      <line x1={cx} y1={cy} x2={cx} y2={cy - r + 6} stroke={color} strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${cx + cy} ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r="2" fill={color} />
    </g>
  );
}

function Gear({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g fill="none" stroke={color}>
      <circle cx={cx} cy={cy} r={r} strokeWidth="5" strokeDasharray="3 3" opacity="0.8" />
      <circle cx={cx} cy={cy} r={r - 6} strokeWidth="1.5" opacity="0.7" />
      <path d={`M${cx - r + 6} ${cy}H${cx + r - 6}M${cx} ${cy - r + 6}V${cy + r - 6}`} strokeWidth="2" opacity="0.6" />
      <circle cx={cx} cy={cy} r="3" fill={color} stroke="none" />
    </g>
  );
}

export function WatchArt({
  look,
  className,
  title,
}: {
  look: WatchLook;
  className?: string;
  title?: string;
}) {
  const id = useId();
  const sheen = `${id}-sheen`;
  const glow = `${id}-glow`;
  const strapShade = `${id}-strap`;
  const dialClip = `${id}-clip`;
  const smart = look.face === "smart";

  return (
    <svg
      viewBox="0 0 320 520"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={glow} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={look.dialGlow} stopOpacity="0.95" />
          <stop offset="0.6" stopColor={look.dialGlow} stopOpacity="0.15" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        <linearGradient id={strapShade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <clipPath id={dialClip}>
          {smart ? (
            <rect x="78" y="166" width="164" height="188" rx="38" />
          ) : (
            <circle cx={CX} cy={CY} r="98" />
          )}
        </clipPath>
      </defs>

      {/* strap */}
      {[0, 330].map((y) => (
        <g key={y}>
          <rect x="108" y={y} width="104" height="190" rx="16" fill={look.strap} />
          <rect x="108" y={y} width="104" height="190" rx="16" fill={`url(#${strapShade})`} />
          <rect x="118" y={y + 8} width="84" height="174" rx="10" fill="none" stroke="#fff" strokeOpacity="0.16" strokeDasharray="5 5" />
        </g>
      ))}

      {smart ? (
        <>
          <rect x="262" y="236" width="12" height="36" rx="5" fill={look.caseColor} />
          <rect x="60" y="148" width="200" height="224" rx="56" fill={look.caseColor} />
          <rect x="60" y="148" width="200" height="224" rx="56" fill={`url(#${sheen})`} />
          <rect x="72" y="160" width="176" height="200" rx="44" fill="#050608" />
          <rect x="78" y="166" width="164" height="188" rx="38" fill={look.dial} />
          <g clipPath={`url(#${dialClip})`}>
            <circle cx="110" cy="330" r="120" fill={look.dialGlow} opacity="0.22" />
            <circle cx={CX} cy="300" r="34" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="9" />
            <circle
              cx={CX}
              cy="300"
              r="34"
              fill="none"
              stroke={look.dialGlow}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray="150 214"
              transform={`rotate(-90 ${CX} 300)`}
            />
            <text x={CX} y="236" textAnchor="middle" fill={look.hands} fontSize="44" fontWeight="300" fontFamily="var(--font-geist-sans), sans-serif">
              10:09
            </text>
            <text x={CX} y="306" textAnchor="middle" fill={look.hands} fontSize="15" fontFamily="var(--font-geist-sans), sans-serif" opacity="0.85">
              72
            </text>
          </g>
          <path d="M96 172h70l-64 150V198a26 26 0 0 1 -6-26z" fill="#fff" opacity="0.05" />
        </>
      ) : (
        <>
          {/* lugs and crown */}
          <rect x="100" y="150" width="120" height="220" rx="26" fill={look.caseColor} />
          <rect x="100" y="150" width="120" height="220" rx="26" fill={`url(#${sheen})`} />
          <rect x="272" y="246" width="22" height="28" rx="6" fill={look.caseColor} />
          <rect x="272" y="246" width="22" height="28" rx="6" fill={`url(#${sheen})`} />

          {/* case and coin-edge bezel */}
          <circle cx={CX} cy={CY} r="120" fill={look.caseColor} />
          <circle cx={CX} cy={CY} r="120" fill={`url(#${sheen})`} />
          <circle cx={CX} cy={CY} r="111" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="9" strokeDasharray="2 3" />
          <circle cx={CX} cy={CY} r="103" fill="#07080a" />

          {/* dial */}
          <circle cx={CX} cy={CY} r="98" fill={look.dial} />
          <circle cx={CX} cy={CY} r="98" fill={`url(#${glow})`} />
          <g clipPath={`url(#${dialClip})`}>
            {look.face === "skeleton" && (
              <>
                <circle cx={CX} cy={CY} r="70" fill="#000" opacity="0.35" />
                <Gear cx={CX - 4} cy={CY - 34} r={30} color={look.hands} />
                <Gear cx={CX + 40} cy={CY + 6} r={20} color={look.caseColor} />
                <Gear cx={CX - 44} cy={CY + 12} r={16} color={look.caseColor} />
                <path d={`M${CX - 80} ${CY - 6}L${CX + 80} ${CY + 22}`} stroke={look.dialGlow} strokeWidth="9" opacity="0.8" strokeLinecap="round" />
                <circle cx={CX} cy={CY + 54} r="30" fill="#050608" />
                <circle cx={CX} cy={CY + 54} r="30" fill="none" stroke={look.caseColor} strokeWidth="3" />
                <Gear cx={CX} cy={CY + 54} r={20} color={look.hands} />
              </>
            )}
            {look.face === "chrono" && (
              <>
                <Subdial cx={CX - 42} cy={CY} r={24} color={look.hands} />
                <Subdial cx={CX + 42} cy={CY} r={24} color={look.hands} />
                <Subdial cx={CX} cy={CY + 46} r={24} color={look.hands} />
              </>
            )}
            {look.face === "classic" && (
              <>
                <rect x={CX + 46} y={CY - 10} width="24" height="20" rx="3" fill="#f4f1ea" />
                <text x={CX + 58} y={CY + 5} textAnchor="middle" fontSize="13" fontWeight="600" fill="#15161a" fontFamily="var(--font-geist-sans), sans-serif">
                  09
                </text>
                <line x1={CX - 16} y1={CY - 44} x2={CX + 16} y2={CY - 44} stroke={look.hands} strokeWidth="2" opacity="0.7" />
                <line x1={CX - 9} y1={CY - 37} x2={CX + 9} y2={CY - 37} stroke={look.hands} strokeWidth="1" opacity="0.5" />
              </>
            )}
          </g>
          <Indices color={look.hands} />
          <Hands color={look.hands} seconds={look.face === "skeleton" ? look.hands : "#e5484d"} />

          {/* crystal highlight */}
          <path d={`M${CX - 86} ${CY - 46}A98 98 0 0 1 ${CX + 30} ${CY - 93}L${CX - 60} ${CY + 76}A98 98 0 0 1 ${CX - 86} ${CY - 46}z`} fill="#fff" opacity="0.06" />
        </>
      )}
    </svg>
  );
}
