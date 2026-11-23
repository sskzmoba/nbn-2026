import React from "react";
import { Composition } from "remotion";
import { GuidingLights, OgImage, TOTAL_FRAMES, FPS } from "./GuidingLights";
import { TeachersStory } from "./TeachersStory";
import { Felicitation, FelicitationCream, FelicitationOriginal, FelicitationOriginalCream } from "./Felicitation";
import { Programme, ProgrammeCream } from "./Programme";
import { Budget } from "./Budget";
import { Speakers, SpeakersCream, SpeakersLargeCream, SpeakersChosenCream, SpeakersInvitedCream } from "./Speakers";
import { InviteCongratsCream, InviteHonouredCream } from "./Invitation";
import { GroupPortrait, GroupSchool } from "./GroupPicture";
import { SpeakersFilm, FILM_FRAMES } from "./SpeakersFilm";
import { FelicitationTable, TABLE_FRAMES } from "./FelicitationTable";
import { YouTubeThumb } from "./YouTubeThumb";
import { Honoured, HONOURED_SLIDES, Panel, PANEL_SLIDES, Thanks, THANKS_SLIDES } from "./Carousels";
import { InstaReel, REEL_FRAMES, InstaGuest, GUESTS } from "./InstaReel";
import { SpeakerBite, SB_FPS, biteFrames } from "./SpeakerBite";
import { BITES } from "./bites";
import { BreezeTalk, breezeTalkFrames } from "./BreezeTalk";
import { HighlightsIntro, HighlightsOutro, HL_FPS, INTRO_SEC, OUTRO_SEC } from "./Highlights";

export const Root: React.FC = () => (
  <>
    <Composition id="SpeakersFilm" component={SpeakersFilm} durationInFrames={FILM_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="InstaReel" component={InstaReel} durationInFrames={REEL_FRAMES} fps={FPS} width={1080} height={1920} />
    {Object.entries(GUESTS).map(([id, g]) => (
      <Composition key={id} id={`InstaGuest-${id}`} component={InstaGuest} defaultProps={{ id }} durationInFrames={g.total} fps={FPS} width={1080} height={1920} />
    ))}
    <Composition id="CarouselHonoured" component={Honoured} durationInFrames={HONOURED_SLIDES} fps={FPS} width={1080} height={1350} />
    <Composition id="CarouselPanel" component={Panel} durationInFrames={PANEL_SLIDES} fps={FPS} width={1080} height={1350} />
    <Composition id="CarouselThanks" component={Thanks} durationInFrames={THANKS_SLIDES} fps={FPS} width={1080} height={1350} />
    <Composition id="YouTubeThumb" component={YouTubeThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="FelicitationTable" component={FelicitationTable} durationInFrames={TABLE_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="BreezeTalk" component={BreezeTalk} durationInFrames={breezeTalkFrames} fps={30} width={1920} height={1080} />
    {Object.entries(BITES).map(([k, b]) => (
      <Composition key={k} id={`Bite-${k}`} component={SpeakerBite} defaultProps={b} durationInFrames={biteFrames(b.data)} fps={SB_FPS} width={1080} height={1920} />
    ))}
    <Composition id="HighlightsIntro" component={HighlightsIntro} durationInFrames={Math.round(INTRO_SEC * HL_FPS)} fps={HL_FPS} width={1920} height={1080} />
    <Composition id="HighlightsOutro" component={HighlightsOutro} durationInFrames={Math.round(OUTRO_SEC * HL_FPS)} fps={HL_FPS} width={1920} height={1080} />
    <Composition id="GroupPortrait" component={GroupPortrait} durationInFrames={1} fps={FPS} width={1080} height={1080} />
    <Composition id="GroupSchool" component={GroupSchool} durationInFrames={1} fps={FPS} width={1080} height={1080} />
    <Composition id="Budget" component={Budget} durationInFrames={1} fps={FPS} width={1080} height={1310} />
    <Composition id="Programme" component={Programme} durationInFrames={1} fps={FPS} width={1080} height={1620} />
    <Composition id="ProgrammeCream" component={ProgrammeCream} durationInFrames={1} fps={FPS} width={1080} height={1620} />
    <Composition id="Speakers" component={Speakers} durationInFrames={1} fps={FPS} width={1080} height={2060} />
    <Composition id="SpeakersCream" component={SpeakersCream} durationInFrames={1} fps={FPS} width={1080} height={2060} />
    <Composition id="SpeakersLargeCream" component={SpeakersLargeCream} durationInFrames={1} fps={FPS} width={1080} height={2600} />
    <Composition id="SpeakersChosenCream" component={SpeakersChosenCream} durationInFrames={1} fps={FPS} width={1080} height={2600} />
    <Composition id="SpeakersInvitedCream" component={SpeakersInvitedCream} durationInFrames={1} fps={FPS} width={1080} height={2600} />
    <Composition id="InviteCongratsCream" component={InviteCongratsCream} durationInFrames={1} fps={FPS} width={1080} height={1880} />
    <Composition id="InviteHonouredCream" component={InviteHonouredCream} durationInFrames={1} fps={FPS} width={1080} height={2000} />
    <Composition id="FelicitationOriginal"component={FelicitationOriginal} durationInFrames={1} fps={FPS} width={1080} height={1620} />
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
    <Composition id="TeachersStoryHeld" component={TeachersStory} defaultProps={{ held: true }} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
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
