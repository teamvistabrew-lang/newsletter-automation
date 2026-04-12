import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const ProgressBar: React.FC<{
  color?: string;
}> = ({ color = "#3B82F6" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 100]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: "rgba(255,255,255,0.1)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: color,
          borderRadius: 2,
        }}
      />
    </div>
  );
};
