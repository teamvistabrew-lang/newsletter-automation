import React from "react";
import { AbsoluteFill } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { NewsTicker } from "../components/NewsTicker";
import { CaptionOverlay } from "../components/CaptionOverlay";
import { COLORS } from "../data/schema";

export const HookScene: React.FC<{
  title: string;
  tag?: string;
  brandName?: string;
  accentColor?: string;
  accentColor2?: string;
  highlightWords?: string[];
}> = ({
  title,
  tag = "BREAKING",
  brandName = "GenAI Art",
  accentColor = COLORS.accentBlue,
  accentColor2 = COLORS.accentPurple,
  highlightWords = [],
}) => {
  return (
    <AbsoluteFill>
      <GradientBackground
        color1={accentColor}
        color2={accentColor2}
        showGrid={true}
        showParticles={true}
      />
      <NewsTicker label={tag} brandName={brandName} accentColor={accentColor} />
      <CaptionOverlay
        text={title}
        fontSize={68}
        delay={6}
        accentColor={COLORS.accentCyan}
        highlightWords={highlightWords}
        position="center"
      />
    </AbsoluteFill>
  );
};
