import React, {useState} from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoEmbed.module.css';

import {
  Figure,
  ThirdPartyConsent,
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

  return (
    <div className={styles.VideoEmbed}
         style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <Figure caption={configuration.caption}>
        <ViewportDependentPillarBoxes aspectRatio={aspectRatios[configuration.aspectRatio || 'wide']}
                                      position={configuration.position}
                                      opaque={!!configuration.caption}>
          {shouldLoad && <PreparedPlayer contentElementId={contentElementId}
                                         configuration={configuration} />}
        </ViewportDependentPillarBoxes>
      </Figure>
    </div>
  );
}

function PreparedPlayer({contentElementId, configuration}) {
  const [playerState, setPlayerState] = useState('unplayed');

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
    <ThirdPartyConsent providerName='video'
                       hideTooltip={playerState === 'playing'}
                       optOutPlacement='bottom-25'>
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
    </ThirdPartyConsent>
  );
}
