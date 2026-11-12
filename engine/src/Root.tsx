import React from "react";
import { Composition } from "remotion";
import { Starter } from "./videos/Starter";
import { VIDEO_ENTRIES } from "./videos/registry";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Starter"
      component={Starter}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
    />

    {VIDEO_ENTRIES.map((video) => (
      <Composition
        key={video.id}
        id={video.id}
        component={video.component}
        durationInFrames={video.durationInFrames}
        fps={video.fps}
        width={video.width}
        height={video.height}
      />
    ))}
  </>
);
