export const Colors = {
  // Primary Colors (aire/agua)
  primary: "#2A9D8F", // verde azulado suave
  primaryDark: "#1E6B5A", // bosque profundo
  primaryLight: "#D4F1EF", // agua cristalina

  // Secondary Colors (vegetación)
  secondary: "#8CBF26", // verde hoja
  secondaryDark: "#5D7A18", // verde musgo
  secondaryLight: "#E6F4D9", // verde muy claro

  // Accent Colors (CO₂ / alertas)
  accent: "#F4A261", // naranja cálido
  accentDark: "#C27A46", // terracota
  accentLight: "#FFEDD8", // melocotón pálido

  // Error Color
  error: "#E76F51", // rojo ladrillo
  errorDark: "#A84532",
  errorLight: "#FDE3DF",

  // Warning & Success
  warning: "#E9C46A", // mostaza suave
  warningLight: "#FEF8E7",
  success: "#2A9D8F", // mismo que primary para armonía
  successLight: "#D4F1EF",

  // Neutral Colors
  background: "#F0F3F1", // gris muy suave
  surface: "#FFFFFF",
  card: "#FFFFFF",

  // Text Colors
  text: "#264653", // azul petróleo oscuro
  textSecondary: "#406E7A", // gris azulado medio
  textLight: "#6C7A89",
  textMuted: "#AAB2B9",

  // Border & Dividers
  border: "#E0E4E3",
  divider: "#F3F4F3",

  // Status Colors
  online: "#55A630", // verde vivo
  offline: "#E63946", // rojo vivo
  pending: "#F4A261", // mismo que accent

  destructive: "#E63946",

  // Gradients
  gradientPrimary: ["#2A9D8F", "#8CBF26"] as [string, string, ...string[]],
  gradientSecondary: ["#8CBF26", "#2A9D8F"] as [string, string, ...string[]],
  gradientAccent: ["#F4A261", "#E76F51"] as [string, string, ...string[]],

  // Shadows
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
};
