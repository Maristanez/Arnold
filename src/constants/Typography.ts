import { TextStyle } from "react-native";
import { Colors } from "./Colors";

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textPrimary,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    color: "#E0E0E0",
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    color: "#E0E0E0",
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.textSecondary,
    lineHeight: 16,
  },
} as const;
