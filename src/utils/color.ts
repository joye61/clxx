/**
 * 将 #rrggbb 颜色按比例变暗；amount 取值 0~1
 * 例：darken("#2f7dff", 0.15) → #2a6cd9（用于派生交互态色）
 */
export function darken(hex: string, amount: number): string {
  const m = hex.replace("#", "");
  if (m.length !== 6) return hex;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const factor = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * (1 - amount))));
  const toHex = (v: number) => factor(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
