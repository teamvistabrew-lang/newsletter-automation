import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../data/schema";

const FloatingOrb: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  delay: number;
}> = ({ x, y, size, color, speed, delay }) => {
  const frame = useCurrentFrame();

  const floatY = interpolate(
    ((frame + delay) * speed) % 300,
    [0, 150, 300],
    [0, -40, 0]
  );
  const floatX = interpolate(
    ((frame + delay + 50) * speed * 0.7) % 400,
    [0, 200, 400],
    [0, 25, 0]
  );
  const pulse = interpolate(
    ((frame + delay) * 0.5) % 120,
    [0, 60, 120],
    [0.6, 1, 0.6]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}40 0%, ${color}00 70%)`,
        filter: `blur(${size * 0.4}px)`,
        transform: `translate(${floatX}px, ${floatY}px) scale(${pulse})`,
      }}
    />
  );
};

const GridOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 0.04], {
    extrapolateRight: "clamp",
  });
  const scroll = interpolate(frame, [0, 600], [0, -100]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transform: `translateY(${scroll}px)`,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
};

const Particles: React.FC<{ color: string; count?: number }> = ({
  color,
  count = 15,
}) => {
  const frame = useCurrentFrame();

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const baseX = ((i * 137) % 1080);
        const speed = 0.3 + (i % 5) * 0.15;
        const size = 2 + (i % 4);
        const delay = i * 40;

        const y = interpolate(
          ((frame + delay) * speed) % 400,
          [0, 400],
          [1920 + 20, -20]
        );
        const opacity = interpolate(
          ((frame + delay) * speed) % 400,
          [0, 100, 300, 400],
          [0, 0.6, 0.6, 0]
        );
        const drift = interpolate(
          ((frame + delay) * 0.3) % 200,
          [0, 100, 200],
          [0, 15, 0]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: baseX + drift,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

export const GradientBackground: React.FC<{
  color1?: string;
  color2?: string;
  showGrid?: boolean;
  showParticles?: boolean;
}> = ({
  color1 = COLORS.accentBlue,
  color2 = COLORS.accentPurple,
  showGrid = true,
  showParticles = true,
}) => {
  const frame = useCurrentFrame();

  // Slowly shifting gradient overlay
  const hueShift = interpolate(frame, [0, 600], [0, 30]);

  return (
    <AbsoluteFill style={{ background: COLORS.bgDarker, overflow: "hidden" }}>
      {/* Large floating orbs */}
      <FloatingOrb x={100} y={300} size={500} color={color1} speed={0.4} delay={0} />
      <FloatingOrb x={600} y={900} size={400} color={color2} speed={0.3} delay={80} />
      <FloatingOrb x={300} y={1400} size={350} color={color1} speed={0.35} delay={160} />
      <FloatingOrb x={700} y={200} size={300} color={color2} speed={0.25} delay={40} />

      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, ${COLORS.bgDarker} 100%)`,
        }}
      />

      {/* Grid overlay */}
      {showGrid && <GridOverlay />}

      {/* Rising particles */}
      {showParticles && <Particles color={`${color1}90`} count={12} />}
      {showParticles && <Particles color={`${color2}70`} count={8} />}
    </AbsoluteFill>
  );
};
