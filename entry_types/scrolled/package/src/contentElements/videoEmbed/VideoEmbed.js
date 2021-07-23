import React, {useState} from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoEmbed.module.css';

import {
  Figure,
  ThirdPartyOptIn,
  ThirdPartyOptOutInfo,
  FitViewport,
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
    <div style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <FitViewport
        aspectRatio={aspectRatios[configuration.aspectRatio || 'wide']}>
        <Figure caption={configuration.caption}>
          <FitViewport.Content>
            {shouldLoad && <PreparedPlayer playerState={playerState}
                                           setPlayerState={setPlayerState}
                                           contentElementId={contentElementId}
                                           configuration={configuration} />}
          </FitViewport.Content>
          <ThirdPartyOptOutInfo providerName="video"
                                hide={playerState === 'playing'}
                                contentElementPosition={configuration.position} />
        </Figure>
        </FitViewport>
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

  // React player does not re-create player when controls or config
  // prop changes. Ensure key changes to force React to re-mount
  // component.
  function keyFromConfiguration(config) {
    return [config.hideControls, config.hideInfo].join('');
  }

  return (
    <ThirdPartyOptIn providerName="video">
      {({consentedHere}) => (
        <ReactPlayer className={styles.embedPlayer}
                     key={keyFromConfiguration(configuration)}
                     url={configuration.videoSource}
                     playing={playerState !== 'paused'}
                     onPlay={() => setPlayerState('playing')}
                     onPause={() => setPlayerState('paused')}
                     onEnded={() => setPlayerState('paused')}
                     light={!consentedHere && playerState === 'unplayed'}
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
