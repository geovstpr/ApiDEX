// Paleta inspirada en la pantalla y carcasa de la Game Boy Advance
export const colors = {
  screenBg: "#9bbc0f", // verde pantalla LCD clasica
  screenBgDark: "#8bac0f", // variante un poco mas oscura, para contraste
  screenLine: "#306230", // verde oscuro, para bordes y texto sobre pantalla
  shellPurple: "#5a4a8f", // morado del cuerpo de la consola (para acentos)
  shellPurpleDark: "#3f3468",
  black: "#0f380f", // "negro" del LCD (nunca negro puro, para mantener el look retro)
  white: "#e0f8d0", // "blanco" del LCD (verde muy claro, no blanco puro)
  danger: "#d04648",
  gold: "#f0c419",
};

// Tamanos base para mantener proporciones consistentes de estilo "pixel art"
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const borderRadius = {
  none: 0, // el estilo retro usa esquinas cuadradas, no redondeadas
  sm: 2,
};

export const fonts = {
  pixel: "PressStart2P_400Regular",
};
