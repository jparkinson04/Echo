export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalised = hex.replace('#', '');
  const full =
    normalised.length === 3
      ? normalised.split('').map((c) => c + c).join('')
      : normalised;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function lightenHex(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = percent / 100;
  return rgbToHex(
    Math.round(r + (255 - r) * factor),
    Math.round(g + (255 - g) * factor),
    Math.round(b + (255 - b) * factor),
  );
}

export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function injectAccentColour(hex: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--color-pop', hex);
  document.documentElement.style.setProperty('--color-pop-light', lightenHex(hex, 20));
  document.documentElement.style.setProperty('--color-pop-bg', hexToRgba(hex, 0.12));
}

export const ACCENT_PRESETS = [
  { name: 'Neon Green (default)', hex: '#00E090' },
  { name: 'Spring Green', hex: '#3AF584' },
  { name: 'Royal Purple', hex: '#7B2FBE' },
  { name: 'Hot Pink', hex: '#F72585' },
  { name: 'Burnt Orange', hex: '#E85D04' },
  { name: 'Gold', hex: '#D4A017' },
  { name: 'Teal', hex: '#1D9E75' },
  { name: 'Slate', hex: '#3D5A80' },
] as const;
