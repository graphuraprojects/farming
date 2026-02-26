/* ═══════════════════════════════════════════════════
   SHARED PREMIUM THEME — matches Homepage design
   Import: import { color, shadow, fadeUp, stagger } from "../../theme"
   ═══════════════════════════════════════════════════ */

export const color = {
  emerald:     "#047857",
  emeraldMid:  "#059669",
  forest:      "#064e3b",
  deepForest:  "#022c22",
  sage:        "#a7c4a0",
  mintCream:   "#f0faf4",
  paleGreen:   "#e6f4ea",
  lush:        "#10b981",
  gold:        "#c8a55a",
  warmGold:    "#d4a853",
  ivory:       "#fdfcf8",
  bg:          "#f8faf7",
  text:        "#1a1a1a",
  textSoft:    "#6b7280",
  border:      "#e8efe9",
  inputBorder: "#d1d9d3",
  inputFocus:  "#047857",
  cardBg:      "#ffffff",
  danger:      "#dc2626",
  warn:        "#f59e0b",
  info:        "#3b82f6",
};

export const shadow = {
  sm:   "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  md:   "0 4px 16px rgba(0,0,0,0.06)",
  lg:   "0 8px 30px rgba(0,0,0,0.08)",
  xl:   "0 20px 60px rgba(0,0,0,0.1)",
  glow: "0 0 40px rgba(4,120,87,0.08), 0 8px 30px rgba(0,0,0,0.08)",
};

export const radius = {
  sm:  "8px",
  md:  "12px",
  lg:  "16px",
  xl:  "20px",
  xxl: "24px",
  full: "9999px",
};

/* framer-motion variants */
export const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideLeft = {
  hidden:  { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

export const slideRight = {
  hidden:  { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* shared CSS classes (Tailwind) */
export const inputClass =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-offset-0";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-white text-sm py-3 px-6 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] shadow-md hover:shadow-lg";

export const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm py-3 px-6 border transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]";

export const sectionHeading =
  "text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight";

export const cardBase =
  "bg-white rounded-2xl overflow-hidden transition-all duration-300";

export const gradientText = (from = color.emerald, to = color.forest) => ({
  backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

export const gradientBg = (from = color.emerald, to = color.forest) =>
  `linear-gradient(135deg, ${from}, ${to})`;
