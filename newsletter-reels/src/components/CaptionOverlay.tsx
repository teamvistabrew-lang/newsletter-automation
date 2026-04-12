import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_HEADLINE, FONT_BODY } from "../fonts/loadFonts";
import { COLORS } from "../data/schema";

/**
 * Kinetic text words — reusable word-by-word spring animation.
 * Can be used as absolute overlay OR inline in a flex layout.
 */
const KineticWords: React.FC<{
  text: string;
  fontSize: number;
  delay: number;
  accentColor: string;
  highlightWords: string[];
  justify?: "center" | "flex-start";
}> = ({ text, fontSize, delay, accentColor, highlightWords, justify = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");
  const highlightSet = new Set(
    highlightWords.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""))
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `4px ${fontSize * 0.2}px`,
        justifyContent: justify,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delay + i * 2;

        const progress = spring({
          frame: frame - wordDelay,
          fps,
          config: { damping: 14, stiffness: 160, mass: 0.5 },
        });

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateY = interpolate(progress, [0, 1], [40, 0]);
        const scale = interpolate(progress, [0, 0.6, 1], [0.6, 1.08, 1]);

        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
        const isHighlight = highlightSet.has(cleanWord);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: FONT_HEADLINE,
              fontSize,
              fontWeight: 900,
              lineHeight: 1.2,
              letterSpacing: -1,
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              color: isHighlight ? accentColor : COLORS.textPrimary,
              textShadow: isHighlight
                ? `0 0 30px ${accentColor}60, 0 2px 10px rgba(0,0,0,0.8)`
                : "0 2px 10px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)",
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
 * Absolute-positioned kinetic caption overlay — for hook/simple scenes.
 */
export const CaptionOverlay: React.FC<{
  text: string;
  fontSize?: number;
  delay?: number;
  accentColor?: string;
  highlightWords?: string[];
  position?: "center" | "lower";
}> = ({
  text,
  fontSize = 62,
  delay = 0,
  accentColor = COLORS.accentCyan,
  highlightWords = [],
  position = "center",
}) => {
  const positionStyle: React.CSSProperties =
    position === "lower"
      ? { bottom: 380, left: 60, right: 60 }
      : { top: "50%", left: 60, right: 60, transform: "translateY(-50%)" };

  return (
    <div style={{ position: "absolute", ...positionStyle, zIndex: 40 }}>
      <KineticWords
        text={text}
        fontSize={fontSize}
        delay={delay}
        accentColor={accentColor}
        highlightWords={highlightWords}
      />
    </div>
  );
};

/**
 * Inline kinetic title — for use inside flex layouts (ContentScene).
 * NOT absolute positioned.
 */
export const InlineKineticTitle: React.FC<{
  text: string;
  fontSize?: number;
  delay?: number;
  accentColor?: string;
  highlightWords?: string[];
}> = ({
  text,
  fontSize = 50,
  delay = 4,
  accentColor = COLORS.accentCyan,
  highlightWords = [],
}) => {
  return (
    <KineticWords
      text={text}
      fontSize={fontSize}
      delay={delay}
      accentColor={accentColor}
      highlightWords={highlightWords}
      justify="flex-start"
    />
  );
};

/**
 * Subtitle text — smaller body text below the main caption.
 */
export const SubtitleOverlay: React.FC<{
  text: string;
  delay?: number;
  position?: "center" | "lower";
}> = ({ text, delay = 15, position = "lower" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [25, 0]);

  const posStyle: React.CSSProperties =
    position === "lower"
      ? { bottom: 340, left: 60, right: 60 }
      : { top: "62%", left: 80, right: 80, textAlign: "center" };

  return (
    <div
      style={{
        position: "absolute",
        ...posStyle,
        zIndex: 40,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: FONT_BODY,
        fontSize: 30,
        fontWeight: 400,
        color: COLORS.textSecondary,
        lineHeight: 1.5,
        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
      }}
    >
      {text}
    </div>
  );
};
