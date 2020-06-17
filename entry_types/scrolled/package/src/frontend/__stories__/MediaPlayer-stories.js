import React from 'react';
import {storiesOf} from '@storybook/react';
import {normalizeAndMergeFixture, filePermaId} from 'pageflow-scrolled/spec/support/stories';

import {RootProviders, AudioPlayer, VideoPlayer, usePlayerState} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Frontend/Media Player', module);

stories.add(
  'Media Video Player - Contain',
  () => {
    const [playerState, playerActions] = usePlayerState()

    return (
        <RootProviders seed={normalizeAndMergeFixture({})}>
          <VideoPlayer id={filePermaId('videoFiles', 'interview_toni')}
                       playerState={playerState}
                       playerActions={playerActions} />
        </RootProviders>
    );
  },
  {
    percy: {skip: true}
  }
);

stories.add(
  'Media Video Player - Cover',
  () => {
    const [playerState, playerActions] = usePlayerState()

    return (
      <RootProviders seed={normalizeAndMergeFixture({})}>
        <div style={{height: '100vh'}}>
          <VideoPlayer id={filePermaId('videoFiles', 'interview_toni')}
                       fit="cover"
                       playerState={playerState}
                       playerActions={playerActions} />
        </div>
      </RootProviders>
    );
  },
  {
    percy: {skip: true}
  }
);

stories.add(
  'Media Audio Player',
  () => {
    const [playerState, playerActions] = usePlayerState()

    return (
      <RootProviders seed={normalizeAndMergeFixture({})}>
        <AudioPlayer id={filePermaId('audioFiles', 'quicktime_jingle')}
                     playerState={playerState}
                     playerActions={playerActions} />
      </RootProviders>
    );
  },
  {
    percy: {skip: true}
  }
);
