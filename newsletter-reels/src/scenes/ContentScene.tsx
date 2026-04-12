import React from "react";
import { AbsoluteFill } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { NewsTicker } from "../components/NewsTicker";
import { CaptionOverlay, InlineKineticTitle, SubtitleOverlay } from "../components/CaptionOverlay";
import { GlassCard, BulletPoint } from "../components/AnimatedText";
import { COLORS, SAFE_ZONE } from "../data/schema";

export const ContentScene: React.FC<{
  title: string;
  body: string;
  tag?: string;
  brandName?: string;
  accentColor?: string;
  accentColor2?: string;
  highlightWords?: string[];
}> = ({
  title,
  body,
  tag = "AI NEWS",
  brandName = "GenAI Art",
  accentColor = COLORS.accentBlue,
  accentColor2 = COLORS.accentPurple,
  highlightWords = [],
}) => {
  const bullets = body
    .split(/[•\n]/)
    .map((b) => b.trim())
    .filter(Boolean);
  const hasBullets = bullets.length > 1;

  return (
    <AbsoluteFill>
      <GradientBackground
        color1={accentColor}
        color2={accentColor2}
        showGrid={true}
        showParticles={true}
      />
      <NewsTicker label={tag} brandName={brandName} accentColor={accentColor} />

      {hasBullets ? (
        /* Layout: inline title at top, glass card with bullets below */
        <div
          style={{
            position: "absolute",
            top: SAFE_ZONE.top + 60,
            left: SAFE_ZONE.left,
            right: SAFE_ZONE.right,
            bottom: SAFE_ZONE.bottom,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 32,
            zIndex: 40,
          }}
        >
          {/* Title — inline, flows with layout */}
          <InlineKineticTitle
            text={title}
            fontSize={48}
            delay={4}
            accentColor={COLORS.accentCyan}
            highlightWords={highlightWords}
          />

          {/* Bullets in glass card */}
          <GlassCard delay={12} borderColor={`${accentColor}30`}>
            {bullets.map((bullet, i) => (
              <BulletPoint
                key={i}
                delay={16 + i * 6}
                accentColor={accentColor}
                index={i}
              >
                {bullet}
              </BulletPoint>
            ))}
          </GlassCard>
        </div>
      ) : (
        /* Simple layout: centered title, optional subtitle below */
        <>
          <CaptionOverlay
            text={title}
            fontSize={56}
            delay={4}
            accentColor={COLORS.accentCyan}
            highlightWords={highlightWords}
            position="center"
          />
          {body && (
            <SubtitleOverlay text={body} delay={16} position="center" />
          )}
        </>
      )}
    </AbsoluteFill>
  );
};
