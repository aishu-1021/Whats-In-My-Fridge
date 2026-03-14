// Floating food illustrations — rich SVG line art with filled accents
// Designed to feel like vintage Indian street food poster art

const STROKE = "hsl(var(--primary))";
const FILL   = "hsl(var(--primary))";

interface IllustrationProps { size: number; }

// ── Chili pepper — curved body with curling stem ──────────────────────────────
const Chili = ({ size }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="-32 -44 64 80" fill="none"
    stroke={STROKE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0,-30 C-10,-20 -14,-6 -12,8 C-10,20 -4,30 0,34 C4,30 10,20 12,8 C14,-6 10,-20 0,-30Z"/>
    <ellipse cx="0" cy="2" rx="8" ry="12" fill={FILL} fillOpacity="0.15" stroke="none"/>
    <path d="M0,-30 C0,-40 6,-44 10,-40"/>
    <path d="M10,-40 C14,-42 16,-36 12,-32"/>
  </svg>
);

// ── Onion — layered rings with sprout ─────────────────────────────────────────
const Onion = ({ size }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="-28 -40 56 76" fill="none"
    stroke={STROKE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="0" cy="10" rx="24" ry="26"/>
    <ellipse cx="0" cy="10" rx="14" ry="16" strokeOpacity="0.4"/>
    <path d="M-12,-12 C-6,-22 6,-22 12,-12"/>
    <path d="M0,-22 L0,-38"/>
    <path d="M-6,-32 C-4,-38 4,-38 6,-32"/>
    <ellipse cx="0" cy="10" rx="24" ry="26" fill={FILL} fillOpacity="0.08" stroke="none"/>
  </svg>
);

// ── Tomato — round with leaf crown ───────────────────────────────────────────
const Tomato = ({ size }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="-28 -36 56 72" fill="none"
    stroke={STROKE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="0" cy="10" r="24"/>
    <circle cx="0" cy="10" r="24" fill={FILL} fillOpacity="0.12" stroke="none"/>
    <circle cx="0" cy="10" r="12" fill={FILL} fillOpacity="0.12" stroke="none"/>
    <path d="M-10,-14 C-8,-24 -2,-28 0,-26"/>
    <path d="M0,-26 C2,-28 8,-24 10,-14"/>
    <path d="M0,-26 C-6,-32 -12,-30 -14,-24"/>
    <path d="M0,-26 C4,-34 10,-34 10,-28"/>
  </svg>
);

// ── Garlic bulb — full shape with clove lines ─────────────────────────────────
const Garlic = ({ size }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="-26 -40 52 72" fill="none"
    stroke={STROKE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0,-30 C-16,-22 -22,-6 -18,10 C-14,24 -6,30 0,30 C6,30 14,24 18,10 C22,-6 16,-22 0,-30Z"/>
    <path d="M0,-30 C-6,-20 -8,-8 -6,6"/>
    <path d="M0,-30 C6,-20 8,-8 6,6"/>
    <path d="M-18,10 C-10,6 -4,8 0,12 C4,8 10,6 18,10"/>
    <path d="M0,-30 L0,-38"/>
    <path d="M-6,-34 C-4,-40 4,-40 6,-34"/>
    <path d="M0,-30 C-16,-22 -22,-6 -18,10 C-14,24 -6,30 0,30 C6,30 14,24 18,10 C22,-6 16,-22 0,-30Z"
      fill={FILL} fillOpacity="0.1" stroke="none"/>
  </svg>
);

// ── Bell pepper — lobed shape with stem ──────────────────────────────────────
const Pepper = ({ size }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="-26 -38 52 74" fill="none"
    stroke={STROKE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0,-28 C-18,-22 -24,-6 -22,10 C-20,24 -10,32 0,34 C10,32 20,24 22,10 C24,-6 18,-22 0,-28Z"/>
    <path d="M-10,-10 C-6,4 6,4 10,-10"/>
    <path d="M-20,6 C-14,18 14,18 20,6"/>
    <path d="M0,-28 C0,-36 4,-38 4,-32"/>
    <path d="M0,-28 C-18,-22 -24,-6 -22,10 C-20,24 -10,32 0,34 C10,32 20,24 22,10 C24,-6 18,-22 0,-28Z"
      fill={FILL} fillOpacity="0.1" stroke="none"/>
  </svg>
);

// ── Spice jar — cylindrical with label band ───────────────────────────────────
const Jar = ({ size }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="-22 -32 44 64" fill="none"
    stroke={STROKE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="-18" y="-8" width="36" height="30" rx="4"/>
    <rect x="-18" y="-8" width="36" height="30" rx="4" fill={FILL} fillOpacity="0.08" stroke="none"/>
    <rect x="-14" y="-22" width="28" height="14" rx="3"/>
    <path d="-20,-8 L20,-8"/>
    <path d="M-20,-8 L20,-8"/>
    <path d="M-12,4 C-4,12 4,12 12,4"/>
    <rect x="-10" y="-18" width="20" height="6" rx="2" fill={FILL} fillOpacity="0.18" stroke="none"/>
  </svg>
);

// ── Curry bowl — wide bowl with steam ────────────────────────────────────────
const Bowl = ({ size }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="-30 -36 60 68" fill="none"
    stroke={STROKE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M-28,-6 C-26,16 -14,28 0,28 C14,28 26,16 28,-6Z"/>
    <path d="M-30,-6 L30,-6"/>
    <path d="M-28,-6 C-26,16 -14,28 0,28 C14,28 26,16 28,-6Z"
      fill={FILL} fillOpacity="0.1" stroke="none"/>
    <ellipse cx="0" cy="6" rx="16" ry="8" fill={FILL} fillOpacity="0.14" stroke="none"/>
    <path d="M-10,-14 C-10,-20 -6,-24 -6,-28" strokeOpacity="0.5"/>
    <path d="M0,-12 C0,-18 4,-22 4,-28" strokeOpacity="0.5"/>
    <path d="M10,-14 C10,-20 6,-24 6,-28" strokeOpacity="0.5"/>
  </svg>
);

// ── Ginger root — knobbly organic shape ──────────────────────────────────────
const Ginger = ({ size }: IllustrationProps) => (
  <svg width={size} height={size} viewBox="-28 -30 56 60" fill="none"
    stroke={STROKE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M-22,2 C-22,-12 -10,-20 0,-18 C8,-16 10,-6 18,-8 C24,-10 28,-2 22,6 C16,14 6,16 0,14 C-10,12 -18,16 -22,8Z"/>
    <path d="M-22,2 C-22,-12 -10,-20 0,-18 C8,-16 10,-6 18,-8 C24,-10 28,-2 22,6 C16,14 6,16 0,14 C-10,12 -18,16 -22,8Z"
      fill={FILL} fillOpacity="0.1" stroke="none"/>
    <path d="M-4,-18 C-2,-26 4,-28 6,-22"/>
    <path d="M18,-8 C22,-16 26,-14 24,-8"/>
    <path d="M-8,2 L8,2" strokeOpacity="0.35"/>
    <path d="M-12,8 L6,8" strokeOpacity="0.35"/>
  </svg>
);

// ── Item definitions — same positions as original ────────────────────────────
const items = [
  { Component: Chili,  top: "10%", left: "5%",   right: undefined, rotation: "-15deg", delay: "0s",   size: 56 },
  { Component: Garlic, top: "20%", left: undefined, right: "8%",   rotation: "20deg",  delay: "0.5s", size: 48 },
  { Component: Tomato, top: "60%", left: "3%",   right: undefined, rotation: "10deg",  delay: "1s",   size: 52 },
  { Component: Onion,  top: "70%", left: undefined, right: "5%",   rotation: "-25deg", delay: "1.5s", size: 46 },
  { Component: Jar,    top: "40%", left: "7%",   right: undefined, rotation: "15deg",  delay: "0.8s", size: 50 },
  { Component: Bowl,   top: "45%", left: undefined, right: "4%",   rotation: "-10deg", delay: "1.2s", size: 54 },
  { Component: Pepper, top: "85%", left: "10%",  right: undefined, rotation: "30deg",  delay: "0.3s", size: 46 },
  { Component: Ginger, top: "15%", left: undefined, right: "15%",  rotation: "-20deg", delay: "0.7s", size: 48 },
];

const FloatingEmojis = () => (
  <>
    {items.map(({ Component, top, left, right, rotation, delay, size }, i) => (
      <span
        key={i}
        className="absolute animate-float pointer-events-none select-none"
        style={{
          top,
          left,
          right,
          opacity: 0.3,
          ["--rotation" as string]: rotation,
          animationDelay: delay,
        }}
      >
        <Component size={size} />
      </span>
    ))}
  </>
);
export default FloatingEmojis;