import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import {normalizeAndMergeFixture, filePermaId} from 'pageflow-scrolled/spec/support/stories';

import {RootProviders, AudioPlayer, VideoPlayer, useFile, usePlayerState} from 'pageflow-scrolled/frontend';

const stories = storiesOf('Frontend/Media Player', module)
  .addDecorator((Story) =>
    <RootProviders seed={normalizeAndMergeFixture({})}>
      <Story />
    </RootProviders>);

function useSampleFile(collectionName, referenceName) {
  return useFile({
    collectionName,
    permaId: filePermaId(collectionName, referenceName)
  });
}

stories.add(
  'Media Video Player - Contain',
  () => {
    const [playerState, playerActions] = usePlayerState()

    return (
      <VideoPlayer videoFile={useSampleFile('videoFiles', 'interview_toni')}
                   playerState={playerState}
                   playerActions={playerActions} />
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
      <div style={{height: '100vh'}}>
        <VideoPlayer videoFile={useSampleFile('videoFiles', 'interview_toni')}
                     fit="cover"
                     playerState={playerState}
                     playerActions={playerActions} />
      </div>
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
      <AudioPlayer audioFile={useSampleFile('audioFiles', 'quicktime_jingle')}
                   playerState={playerState}
                   playerActions={playerActions} />
    );
  },
  {
    percy: {skip: true}
  }
);

stories.add(
  'Media Audio Player - Stress Test',
  () => {
    const [playerState, playerActions] = usePlayerState()

    return (
        <StressTest playerState={playerState} playerActions={playerActions} >
          {shouldLoad =>
            <AudioPlayer audioFile={useSampleFile('audioFiles', 'quicktime_jingle')}
                         load={shouldLoad ? 'auto' : 'none'}
                         playerState={playerState}
                         playerActions={playerActions} />}
        </StressTest>
    );
  },
  {
    percy: {skip: true}
  }
);

stories.add(
  'Media Video Player - Stress Test',
  () => {
    const [playerState, playerActions] = usePlayerState()

    return (
      <StressTest playerState={playerState} playerActions={playerActions} >
        {shouldLoad =>
          <VideoPlayer videoFile={useSampleFile('videoFiles', 'interview_toni')}
                       load={shouldLoad ? 'auto' : 'none'}
                       playerState={playerState}
                       playerActions={playerActions} />}
      </StressTest>
    );
  },
  {
    percy: {skip: true}
  }
);

function StressTest({playerState, playerActions, children}) {
  const [shouldLoad, setShoudLoad] = useState(false);

  function* toggleForever() {
    while (true) {
      setShoudLoad(state => !state);
      yield delay(100);
      playerActions.play();
      yield delay(100);
      playerActions.pause();
      yield delay(100);
    }
  }

  return (
    <div>
      <button onClick={() => run(toggleForever())}>Start</button>
      <br />
      {shouldLoad ? 'Loaded' : 'Not Loaded'}/
      {playerState.isPlaying ? 'Playing' : 'Not Playing'}
      {children(shouldLoad)}
    </div>
  )
}

function delay(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

async function run(commands) {
  for (let c of commands) {
    await c;
  }
}
