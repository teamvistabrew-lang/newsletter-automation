import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONT_HEADLINE } from "../fonts/loadFonts";
import { COLORS } from "../data/schema";

/**
 * Animated news ticker bar at the top — gives a broadcast news feel.
 */
export const NewsTicker: React.FC<{
  label?: string;
  brandName?: string;
  accentColor?: string;
}> = ({
  label = "BREAKING",
  brandName = "GenAI Art",
  accentColor = COLORS.accentBlue,
}) => {
  const frame = useCurrentFrame();

  // Slide in from top
  const slideY = interpolate(frame, [0, 12], [-60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing dot
  const dotOpacity = interpolate(
    (frame * 1.5) % 40,
    [0, 20, 40],
    [1, 0.3, 1]
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        left: 40,
        right: 40,
        opacity,
        transform: `translateY(${slideY}px)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        zIndex: 50,
      }}
    >
      {/* Brand chip */}
      <div
        style={{
          fontFamily: FONT_HEADLINE,
          fontSize: 18,
          fontWeight: 800,
          color: COLORS.textPrimary,
          backgroundColor: accentColor,
          padding: "6px 16px",
          borderRadius: 6,
          letterSpacing: 1,
        }}
      >
        {brandName}
      </div>

      {/* Live dot + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: COLORS.accentRed,
            opacity: dotOpacity,
            boxShadow: `0 0 8px ${COLORS.accentRed}`,
          }}
        />
        <span
          style={{
            fontFamily: FONT_HEADLINE,
            fontSize: 16,
            fontWeight: 700,
            color: COLORS.textMuted,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
