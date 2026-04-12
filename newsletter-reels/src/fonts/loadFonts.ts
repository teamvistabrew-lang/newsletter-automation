import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "500", "700", "800", "900"],
  subsets: ["latin"],
});

const { fontFamily: jetBrainsFamily } = loadJetBrainsMono("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

export const FONT_HEADLINE = interFamily;
export const FONT_BODY = interFamily;
export const FONT_CODE = jetBrainsFamily;
