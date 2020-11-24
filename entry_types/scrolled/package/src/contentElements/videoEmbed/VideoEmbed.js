import React, {useState} from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoEmbed.module.css';

import {
  Figure,
  ThirdPartyOptIn,
  ThirdPartyOptOutInfo,
  ViewportDependentPillarBoxes,
  useContentElementLifecycle,
  useContentElementEditorState,
  useAudioFocus
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

  return (
    <div className={styles.VideoEmbed}
         style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <Figure caption={configuration.caption}>
        <ThirdPartyOptOutInfo providerName="video"
                              hide={playerState === 'playing'}
                              placement="bottom-25"
                              contentElementPosition={configuration.position}>
          <ViewportDependentPillarBoxes aspectRatio={aspectRatios[configuration.aspectRatio || 'wide']}
                                        position={configuration.position}
                                        opaque={!!configuration.caption}>
            {shouldLoad && <PreparedPlayer playerState={playerState}
                                           setPlayerState={setPlayerState}
                                           contentElementId={contentElementId}
                                           configuration={configuration} />}
          </ViewportDependentPillarBoxes>
        </ThirdPartyOptOutInfo>
      </Figure>
    </div>
  );
}

function PreparedPlayer({contentElementId, configuration, playerState, setPlayerState}) {
  useAudioFocus({
    key: contentElementId,
    request: playerState === 'playing',

    onLost() {
      setPlayerState('paused');
    }
  });

  // base64-encoded configuration
  // => make component re-render on configuration changes
  function keyFromConfiguration(config) {
    return btoa(JSON.stringify(config))
  }

  return (
    <ThirdPartyOptIn providerName="video">
      {(consentedHere) => (
        <ReactPlayer className={styles.embedPlayer}
                     key={keyFromConfiguration(configuration)}
                     url={configuration.videoSource}
                     playing={playerState !== 'paused'}
                     onPlay={() => setPlayerState('playing')}
                     onPause={() => setPlayerState('paused')}
                     onEnded={() => setPlayerState('paused')}
                     light={!consentedHere}
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
