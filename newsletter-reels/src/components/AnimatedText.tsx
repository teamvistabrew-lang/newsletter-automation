import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_HEADLINE, FONT_BODY } from "../fonts/loadFonts";
import { COLORS } from "../data/schema";

/**
 * Kinetic text that scales in with spring and has subtle continuous motion.
 */
export const KineticTitle: React.FC<{
  children: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  accentColor?: string;
  accentWords?: string[];
}> = ({
  children,
  delay = 0,
  fontSize = 64,
  color = COLORS.textPrimary,
  accentColor = COLORS.accentCyan,
  accentWords = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = children.split(" ");
  const accentSet = new Set(accentWords.map((w) => w.toLowerCase()));

  return (
    <div
      style={{
        fontFamily: FONT_HEADLINE,
        fontSize,
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: -1.5,
        display: "flex",
        flexWrap: "wrap",
        gap: `0px ${fontSize * 0.22}px`,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delay + i * 3;

        const progress = spring({
          frame: frame - wordDelay,
          fps,
          config: { damping: 14, stiffness: 150, mass: 0.6 },
        });

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateY = interpolate(progress, [0, 1], [50, 0]);
        const scale = interpolate(progress, [0, 0.5, 1], [0.7, 1.05, 1]);

        const isAccent = accentSet.has(word.toLowerCase().replace(/[^a-z0-9]/g, ""));

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              color: isAccent ? accentColor : color,
              textShadow: isAccent ? `0 0 30px ${accentColor}50` : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Glassmorphism card that fades/slides in.
 */
export const GlassCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
  borderColor?: string;
}> = ({ children, delay = 0, borderColor = "rgba(255,255,255,0.1)" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 100, mass: 0.8 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [60, 0]);
  const scale = interpolate(progress, [0, 1], [0.95, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${borderColor}`,
        borderRadius: 20,
        padding: "36px 40px",
      }}
    >
      {children}
    </div>
  );
};

/**
 * Body text with fade-up animation.
 */
export const BodyText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  fontSize?: number;
  color?: string;
}> = ({
  children,
  delay = 8,
  fontSize = 34,
  color = COLORS.textSecondary,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.5 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: FONT_BODY,
        fontSize,
        fontWeight: 400,
        color,
        lineHeight: 1.55,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Animated tag badge with glow.
 */
export const TagBadge: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color = COLORS.accentBlue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  // Subtle pulse
  const pulse = interpolate((frame * 0.5) % 60, [0, 30, 60], [1, 1.03, 1]);

  return (
    <div
      style={{
        display: "inline-block",
        opacity,
        transform: `scale(${scale * pulse})`,
        fontFamily: FONT_HEADLINE,
        fontSize: 20,
        fontWeight: 700,
        color,
        textTransform: "uppercase",
        letterSpacing: 4,
        padding: "10px 24px",
        border: `2px solid ${color}50`,
        borderRadius: 10,
        backgroundColor: `${color}15`,
        boxShadow: `0 0 25px ${color}20`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Bullet point that slides in from left with accent bar.
 */
export const BulletPoint: React.FC<{
  children: React.ReactNode;
  delay?: number;
  accentColor?: string;
  index?: number;
}> = ({ children, delay = 0, accentColor = COLORS.accentBlue, index = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 130 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-80, 0]);
  const barHeight = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        marginBottom: 20,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: 4,
          height: 50,
          backgroundColor: accentColor,
          borderRadius: 2,
          transform: `scaleY(${barHeight})`,
          transformOrigin: "top",
          flexShrink: 0,
          marginTop: 4,
          boxShadow: `0 0 12px ${accentColor}40`,
        }}
      />
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: 32,
          fontWeight: 400,
          color: COLORS.textSecondary,
          lineHeight: 1.5,
        }}
      >
        {children}
      </div>
    </div>
  );
};
