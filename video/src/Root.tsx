import React from "react";
import { Composition } from "remotion";
import { GuidingLights, OgImage, TOTAL_FRAMES, FPS } from "./GuidingLights";

export const Root: React.FC = () => (
  <>
    <Composition
      id="GuidingLights"
      component={GuidingLights}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="OgImage"
      component={OgImage}
      durationInFrames={1}
      fps={FPS}
      width={1200}
      height={630}
    />
  </>
);
