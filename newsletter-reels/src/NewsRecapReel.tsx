import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HookScene } from "./scenes/HookScene";
import { ContentScene } from "./scenes/ContentScene";
import { OutroScene } from "./scenes/OutroScene";
import { ProgressBar } from "./components/ProgressBar";
import { ReelProps } from "./data/schema";

export const NewsRecapReel: React.FC<ReelProps> = ({
  slides,
  brandName,
  handle,
  accentColor,
  accentColor2,
  durationPerSlide,
}) => {
  const fps = 30;
  const framesPerSlide = durationPerSlide * fps;
  const outroFrames = 4 * fps;

  const hookSlide = slides[0];
  const contentSlides = slides.slice(1);

  return (
    <AbsoluteFill>
      <ProgressBar color={accentColor} />

      {/* Hook — kinetic headline with animated bg */}
      <Sequence from={0} durationInFrames={framesPerSlide}>
        <HookScene
          title={hookSlide.title}
          tag={hookSlide.tag || "BREAKING"}
          brandName={brandName}
          accentColor={accentColor}
          accentColor2={accentColor2}
          highlightWords={hookSlide.accent?.split(",").map((w) => w.trim()) || []}
        />
      </Sequence>

      {/* Content scenes — glass cards + bullets on animated bg */}
      {contentSlides.map((slide, i) => (
        <Sequence
          key={i}
          from={(i + 1) * framesPerSlide}
          durationInFrames={framesPerSlide}
        >
          <ContentScene
            title={slide.title}
            body={slide.body}
            tag={slide.tag}
            brandName={brandName}
            accentColor={i % 2 === 0 ? accentColor : accentColor2}
            accentColor2={i % 2 === 0 ? accentColor2 : accentColor}
            highlightWords={slide.accent?.split(",").map((w) => w.trim()) || []}
          />
        </Sequence>
      ))}

      {/* Outro */}
      <Sequence
        from={(contentSlides.length + 1) * framesPerSlide}
        durationInFrames={outroFrames}
      >
        <OutroScene
          brandName={brandName}
          handle={handle}
          accentColor={accentColor}
          accentColor2={accentColor2}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
