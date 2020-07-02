import React, {useState} from 'react';
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

stories.add(
  'Media Audio Player - Stress Test',
  () => {
    const [playerState, playerActions] = usePlayerState()

    return (
      <RootProviders seed={normalizeAndMergeFixture({})}>
        <StressTest playerState={playerState} playerActions={playerActions} >
          {isPrepared =>
            <AudioPlayer id={filePermaId('audioFiles', 'quicktime_jingle')}
                         isPrepared={isPrepared}
                         playerState={playerState}
                         playerActions={playerActions} />}
        </StressTest>
      </RootProviders>
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
      <RootProviders seed={normalizeAndMergeFixture({})}>
        <StressTest playerState={playerState} playerActions={playerActions} >
          {isPrepared =>
            <VideoPlayer id={filePermaId('videoFiles', 'interview_toni')}
                         isPrepared={isPrepared}
                         playerState={playerState}
                         playerActions={playerActions} />}
        </StressTest>
      </RootProviders>
    );
  },
  {
    percy: {skip: true}
  }
);

function StressTest({playerState, playerActions, children}) {
  const [isPrepared, setIsPrepared] = useState(false);

  function* toggleForever() {
    while (true) {
      setIsPrepared(state => !state);
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
      {isPrepared ? 'Prepared' : 'Not Prepated'}/
      {playerState.isPlaying ? 'Playing' : 'Not Playing'}
      {children(isPrepared)}
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
