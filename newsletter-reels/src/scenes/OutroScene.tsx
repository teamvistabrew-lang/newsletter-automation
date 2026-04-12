import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { FONT_HEADLINE, FONT_BODY } from "../fonts/loadFonts";
import { COLORS } from "../data/schema";

export const OutroScene: React.FC<{
  brandName?: string;
  handle?: string;
  accentColor?: string;
  accentColor2?: string;
}> = ({
  brandName = "GenAI Art",
  handle = "@genaiart",
  accentColor = COLORS.accentBlue,
  accentColor2 = COLORS.accentPurple,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brandProgress = spring({
    frame: frame - 3,
    fps,
    config: { damping: 10, stiffness: 80, mass: 1 },
  });
  const brandScale = interpolate(brandProgress, [0, 0.5, 1], [0.3, 1.1, 1]);
  const brandOpacity = interpolate(brandProgress, [0, 1], [0, 1]);

  const ctaProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1]);
  const ctaY = interpolate(ctaProgress, [0, 1], [35, 0]);

  const handleProgress = spring({
    frame: frame - 28,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const handleOpacity = interpolate(handleProgress, [0, 1], [0, 1]);
  const handleScale = interpolate(handleProgress, [0, 0.5, 1], [0.8, 1.06, 1]);

  const ringPulse = interpolate(
    (frame * 0.6) % 60,
    [0, 30, 60],
    [0.95, 1.05, 0.95]
  );

  return (
    <AbsoluteFill>
      <GradientBackground
        color1={accentColor}
        color2={accentColor2}
        showGrid={false}
        showParticles={true}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          zIndex: 40,
        }}
      >
        {/* Pulsing rings */}
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: `2px solid ${accentColor}40`,
            transform: `scale(${brandScale * ringPulse})`,
            boxShadow: `0 0 40px ${accentColor}15`,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 550,
            height: 550,
            borderRadius: "50%",
            border: `1px solid ${accentColor2}25`,
            transform: `scale(${brandScale * ringPulse * 0.95})`,
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
            filter: "blur(40px)",
            transform: `scale(${ringPulse})`,
          }}
        />

        <div
          style={{
            fontFamily: FONT_HEADLINE,
            fontSize: 80,
            fontWeight: 900,
            color: COLORS.textPrimary,
            transform: `scale(${brandScale})`,
            opacity: brandOpacity,
            letterSpacing: -2,
            textShadow: `0 0 50px ${accentColor}40`,
          }}
        >
          {brandName}
        </div>

        <div
          style={{
            marginTop: 48,
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            fontFamily: FONT_BODY,
            fontSize: 34,
            fontWeight: 500,
            color: COLORS.textSecondary,
          }}
        >
          Follow for daily AI news
        </div>

        <div
          style={{
            marginTop: 24,
            opacity: handleOpacity,
            transform: `scale(${handleScale})`,
            fontFamily: FONT_HEADLINE,
            fontSize: 44,
            fontWeight: 700,
            color: accentColor,
            textShadow: `0 0 25px ${accentColor}50`,
          }}
        >
          {handle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
