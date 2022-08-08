import React, {useState, useMemo} from 'react';
import ReactPlayer from 'react-player';

import {getProviderName} from './getProviderName';
import styles from './VideoEmbed.module.css';

import {
  ContentElementBox,
  Figure,
  ThirdPartyOptIn,
  ThirdPartyOptOutInfo,
  FitViewport,
  useContentElementLifecycle,
  useContentElementEditorState,
  useAtmo,
  useAudioFocus,
  useFile
} from 'pageflow-scrolled/frontend';

const aspectRatios = {
  wide: 0.5625,
  narrow: 0.75,
  square: 1,
  portrait: 1.7777
};

export function VideoEmbed({contentElementId, configuration}) {
  const {isEditable, isSelected} = useContentElementEditorState();
  const {shouldLoad} = useContentElementLifecycle();
  const [playerState, setPlayerState] = useState('unplayed');

  const providerName = getProviderName(configuration.videoSource);

  return (
    <div style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <FitViewport
        aspectRatio={aspectRatios[configuration.aspectRatio || 'wide']}>
        <ContentElementBox>
          <Figure caption={configuration.caption}>
            <FitViewport.Content>
              {shouldLoad && <PreparedPlayer playerState={playerState}
                                             setPlayerState={setPlayerState}
                                             contentElementId={contentElementId}
                                             configuration={configuration}
                                             providerName={providerName} />}
            </FitViewport.Content>
            <ThirdPartyOptOutInfo providerName={providerName}
                                  hide={playerState === 'playing'}
                                  contentElementPosition={configuration.position} />
          </Figure>
        </ContentElementBox>
      </FitViewport>
    </div>
  );
}

function PreparedPlayer({
  contentElementId, configuration, playerState, setPlayerState, providerName
}) {
  useAudioFocus({
    key: contentElementId,
    request: playerState === 'playing',

    onLost() {
      setPlayerState('paused');
    }
  });

  useContentElementLifecycle({
    onInvisible() {
      setPlayerState('paused');
    }
  });

  const posterImageFile = useFile({
    collectionName: 'imageFiles',
    permaId: configuration.posterId
  });

  const posterUrl = posterImageFile?.isReady && posterImageFile.urls.large;

  // React player does not re-create player when controls or config
  // prop changes. Ensure key changes to force React to re-mount
  // component.
  function keyFromConfiguration(config) {
    return [config.hideControls, config.hideInfo].join('');
  }

  const atmoHooks = useAtmoHooks(configuration.atmoDuringPlayback);

  function onPlay() {
    setPlayerState('playing');
    atmoHooks.before();
  }

  function onPauseOrEnd() {
    setPlayerState('paused');
    atmoHooks.after();
  }

  return (
    <ThirdPartyOptIn providerName={providerName}>
      {({consentedHere}) => (
        <ReactPlayer className={styles.embedPlayer}
                     key={keyFromConfiguration(configuration)}
                     url={configuration.videoSource}
                     playing={playerState !== 'paused'}
                     onPlay={onPlay}
                     onPause={onPauseOrEnd}
                     onEnded={onPauseOrEnd}
                     light={!consentedHere && playerState === 'unplayed' ?
                            (posterUrl || true) :
                            false}
                     width='100%'
                     height='100%'
                     controls={!configuration.hideControls}
                     config={{
                       youtube: {
                         playerVars: {
                           showinfo: !configuration.hideInfo
                         }
                       },
                       vimeo: {
                         playerOptions: {
                           byline: !configuration.hideInfo
                         }
                       }
                     }} />
      )}
    </ThirdPartyOptIn>
  );
}

function useAtmoHooks(atmoDuringPlayback) {
  const atmo = useAtmo();

  return useMemo(() => {
    const {before, after} = atmo.createMediaPlayerHooks(atmoDuringPlayback);
    let timeout;

    return {
      before() {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        else {
          before();
        }
      },

      after() {
        // When seeking in the video pause and play events
        // fired. Prevent briefly fading the atmo back in.
        timeout = setTimeout(() => {
          after();
          timeout = null;
        }, 1000)
      }
    }
  }, [atmo, atmoDuringPlayback]);
}
