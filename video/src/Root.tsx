import React from "react";
import { Composition } from "remotion";
import { GuidingLights, OgImage, TOTAL_FRAMES, FPS } from "./GuidingLights";
import { TeachersStory } from "./TeachersStory";
import { Felicitation, FelicitationCream, FelicitationOriginal, FelicitationOriginalCream } from "./Felicitation";
import { Programme, ProgrammeCream } from "./Programme";
import { Speakers, SpeakersCream, SpeakersLargeCream, SpeakersChosenCream, SpeakersInvitedCream } from "./Speakers";

export const Root: React.FC = () => (
  <>
    <Composition id="Programme" component={Programme} durationInFrames={1} fps={FPS} width={1080} height={1620} />
    <Composition id="ProgrammeCream" component={ProgrammeCream} durationInFrames={1} fps={FPS} width={1080} height={1620} />
    <Composition id="Speakers" component={Speakers} durationInFrames={1} fps={FPS} width={1080} height={2060} />
    <Composition id="SpeakersCream" component={SpeakersCream} durationInFrames={1} fps={FPS} width={1080} height={2060} />
    <Composition id="SpeakersLargeCream" component={SpeakersLargeCream} durationInFrames={1} fps={FPS} width={1080} height={2600} />
    <Composition id="SpeakersChosenCream" component={SpeakersChosenCream} durationInFrames={1} fps={FPS} width={1080} height={2600} />
    <Composition id="SpeakersInvitedCream" component={SpeakersInvitedCream} durationInFrames={1} fps={FPS} width={1080} height={2600} />
    <Composition id="FelicitationOriginal" component={FelicitationOriginal} durationInFrames={1} fps={FPS} width={1080} height={1620} />
    <Composition id="FelicitationOriginalCream" component={FelicitationOriginalCream} durationInFrames={1} fps={FPS} width={1080} height={1620} />
    <Composition
      id="FelicitationCream"
      component={FelicitationCream}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1620}
    />
    <Composition
      id="Felicitation"
      component={Felicitation}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1620}
    />
    <Composition
      id="TeachersStory"
      component={TeachersStory}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
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
