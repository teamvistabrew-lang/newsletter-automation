import { z } from "zod";

export const slideSchema = z.object({
  title: z.string(),
  body: z.string(),
  accent: z.string().optional(),
  tag: z.string().optional(),
  videoUrl: z.string().optional(), // Local path to background video clip
});

export const reelSchema = z.object({
  slides: z.array(slideSchema).min(1).max(12),
  brandName: z.string().default("GenAI Art"),
  handle: z.string().default("@genaiart"),
  accentColor: z.string().default("#3B82F6"),
  accentColor2: z.string().default("#8B5CF6"),
  durationPerSlide: z.number().default(5),
});

export type Slide = z.infer<typeof slideSchema>;
export type ReelProps = z.infer<typeof reelSchema>;

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;

// Safe zones — Instagram UI overlaps
export const SAFE_ZONE = {
  top: 200,
  bottom: 320,
  left: 80,
  right: 80,
};

export const COLORS = {
  bgDark: "#0C0A1D",
  bgDarker: "#050311",
  textPrimary: "#FFFFFF",
  textSecondary: "#E2E8F0",
  textMuted: "#94A3B8",
  accentBlue: "#3B82F6",
  accentPurple: "#8B5CF6",
  accentCyan: "#22D3EE",
  accentGreen: "#22C55E",
  accentRed: "#EF4444",
  accentOrange: "#F97316",
};
