import React, {useEffect, useState} from 'react';
import {usePrevious} from '../usePrevious';
import {normalizeAndMergeFixture, filePermaId} from 'pageflow-scrolled/spec/support/stories';

import {media} from 'pageflow/frontend';
import {RootProviders, AudioPlayer, VideoPlayer, usePlayerState} from 'pageflow-scrolled/frontend';

export default {
  title: 'Frontend/Media Player/Autoplay',
  parameters: {
    percy: {skip: true}
  }
}

export const video = () =>
  <RootProviders seed={normalizeAndMergeFixture({})}>
    <Test Player={VideoPlayer} id={filePermaId('videoFiles', 'interview_toni')}/>
  </RootProviders>

export const audio = () =>
  <RootProviders seed={normalizeAndMergeFixture({})}>
    <Test Player={AudioPlayer} id={filePermaId('audioFiles', 'quicktime_jingle')} />
  </RootProviders>

function Test({Player, id, playerCount = 4}) {
  const [playingIndex, setPlayingIndex] = useState();
  const [generation, setGeneration] = useState(0);

  function renderPlayers() {
    return Array.from({length: playerCount}, (_, index) =>
      <TestPlayer key={`${generation}-${index}`}
                  Player={Player}
                  id={id}
                  sourceUrlSuffix={`?v=${index}`}
                  playing={playingIndex === index} />
    );
  }

  function* autoplayAllForever() {
    while (true) {
      setPlayingIndex(index => index < playerCount - 1 ? index + 1 : 0);
      yield delay(3000);
    }
  }

  return (
    <div>
      <button onClick={() => media.mute(false) }>Bless player pool</button>
      <button onClick={() => run(autoplayAllForever())}>Autoplay all</button>
      <button onClick={() => setGeneration(n => n + 1)}>Recreate Players</button>
      Generation: {generation}

      {renderPlayers()}
    </div>
  );
}

function TestPlayer({Player, playing, id, sourceUrlSuffix}) {
  const [playerState, playerActions] = usePlayerState();
  const previouslyPlaying = usePrevious(playing);

  useEffect(() => {
    if (previouslyPlaying && !playing) {
      playerActions.pause();
    }
    else if (!previouslyPlaying && playing) {
      playerActions.play();
    }
  }, [playerActions, previouslyPlaying, playing]);

  return (
    <div style={{width: 200, position: 'relative'}}>
      {playerState.isPlaying ? 'Playing' : 'Paused'}
      <Player id={id}
              playsInline={true}
              sourceUrlSuffix={sourceUrlSuffix}
              playerState={playerState}
              playerActions={playerActions} />
    </div>
  );
}

function delay(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

async function run(commands) {
  for (let c of commands) {
    await c;
  }
}
