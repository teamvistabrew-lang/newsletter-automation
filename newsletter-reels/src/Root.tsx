import { Composition } from "remotion";
import { NewsRecapReel } from "./NewsRecapReel";
import { reelSchema, VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "./data/schema";

const DEFAULT_SLIDES = [
  {
    title: "OpenAI's GPT-5 Turbo is here",
    body: "",
    tag: "BREAKING",
  },
  {
    title: "One Model Does Everything",
    body: "Text, images, audio, and video — all from a single model.•No more switching between DALL-E, Sora, and ChatGPT.•API pricing drops 40% compared to GPT-5.",
    tag: "WHAT'S NEW",
  },
  {
    title: "Why Creators Should Care",
    body: "One conversation, every media format.•Unified API replaces 3 separate tools.•15-second video clips built into chat.",
    tag: "WHY IT MATTERS",
  },
  {
    title: "The AI creative era just leveled up",
    body: "",
    tag: "BOTTOM LINE",
  },
];

export const RemotionRoot: React.FC = () => {
  const defaultDuration = 5;
  const totalSlides = DEFAULT_SLIDES.length;
  const outroSeconds = 4;
  const totalFrames = (totalSlides * defaultDuration + outroSeconds) * VIDEO_FPS;

  return (
    <>
      <Composition
        id="NewsRecapReel"
        component={NewsRecapReel}
        durationInFrames={totalFrames}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={reelSchema}
        defaultProps={{
          slides: DEFAULT_SLIDES,
          brandName: "GenAI Art",
          handle: "@genaiart",
          accentColor: "#3B82F6",
          accentColor2: "#8B5CF6",
          durationPerSlide: defaultDuration,
        }}
      />

      <Composition
        id="QuickTeaser"
        component={NewsRecapReel}
        durationInFrames={(2 * 5 + 4) * VIDEO_FPS}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={reelSchema}
        defaultProps={{
          slides: [
            { title: "This AI tool changes everything", tag: "TRENDING", body: "" },
            { title: "Try it now — link in bio", body: "The future of creative AI is here.", tag: "TRY THIS" },
          ],
          brandName: "GenAI Art",
          handle: "@genaiart",
          accentColor: "#8B5CF6",
          accentColor2: "#3B82F6",
          durationPerSlide: 5,
        }}
      />
    </>
  );
};
