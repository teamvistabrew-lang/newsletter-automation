import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  interpolate,
  useCurrentFrame,
} from "remotion";

/**
 * Background video with dark gradient overlay for text readability.
 * If no video provided, falls back to animated gradient.
 */
export const VideoBackground: React.FC<{
  videoSrc?: string;
  overlayOpacity?: number;
  tintColor?: string;
}> = ({
  videoSrc,
  overlayOpacity = 0.55,
  tintColor = "#0C0A1D",
}) => {
  const frame = useCurrentFrame();

  // Subtle zoom over the scene duration for cinematic feel
  const scale = interpolate(frame, [0, 150], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  if (!videoSrc) {
    // Fallback: animated dark gradient with moving highlights
    const hue1 = interpolate(frame, [0, 300], [220, 280]);
    const hue2 = interpolate(frame, [0, 300], [260, 320]);

    return (
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, hsl(${hue1}, 50%, 8%) 0%, hsl(${hue2}, 40%, 5%) 100%)`,
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      {/* Background video with slow zoom */}
      <div
        style={{
          position: "absolute",
          inset: -20, // Slightly oversized to allow zoom without border
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo
          src={videoSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          muted
        />
      </div>

      {/* Dark overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: tintColor,
          opacity: overlayOpacity,
        }}
      />

      {/* Gradient overlays — darker at top and bottom for safe zones */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom,
            ${tintColor}ee 0%,
            ${tintColor}40 15%,
            transparent 35%,
            transparent 65%,
            ${tintColor}40 85%,
            ${tintColor}ee 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
