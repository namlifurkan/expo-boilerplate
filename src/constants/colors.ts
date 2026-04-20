export type ThemeColors = {
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    cardAlt: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
  accent: {
    primary: string;
  };
};

export const DarkColors: ThemeColors = {
  bg: {
    primary: "#000000",
    secondary: "#0A0A0A",
    tertiary: "#141414",
    card: "#1A1A1A",
    cardAlt: "#0D0D0D",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#A0A0A0",
    tertiary: "#666666",
    muted: "#4A4A4A",
  },
  border: {
    primary: "#2A2A2A",
    secondary: "#1F1F1F",
  },
  accent: {
    primary: "#3B82F6",
  },
};

export const LightColors: ThemeColors = {
  bg: {
    primary: "#FFFFFF",
    secondary: "#F5F5F5",
    tertiary: "#EBEBEB",
    card: "#FFFFFF",
    cardAlt: "#F8F8F8",
  },
  text: {
    primary: "#111111",
    secondary: "#666666",
    tertiary: "#999999",
    muted: "#BBBBBB",
  },
  border: {
    primary: "#E0E0E0",
    secondary: "#EEEEEE",
  },
  accent: {
    primary: "#2563EB",
  },
};
