import React, {useRef} from 'react';
import { blankSources } from "pageflow/frontend";
import Measure from 'react-measure';
import Wavesurfer from './Wavesurfer';

import styles from './Waveform.module.css';

const waveColor = '#828282ed';
const waveColorInverted = 'rgba(0, 0, 0, 0.5)';

const cursorColor = '#fff';
const cursorColorInverted = '#888';

export function Waveform(props) {
  let isReady = false;
  let mediaElementId = null;
  let measureRect = useRef();

  if (props.mediaElementId) {
    mediaElementId = `#${props.mediaElementId}`;
    let mediaElement = global.document.querySelector(mediaElementId);
    if (mediaElement) {
      if(mediaElement.src !== blankSources['audio'])
        isReady = true;
    }
  }

  if (isReady) {
    return (
      <Measure client
               onResize={(contentRect) => {
                if (measureRect.current === undefined) {
                  measureRect.current = contentRect.client;
                }
               }}>
        { ({measureRef}) =>
          <div ref={measureRef} className={styles.waveWrapper}>
            <Wavesurfer mediaElt={mediaElementId}
                        playing={props.isPlaying}
                        options={{
                          normalize: true,
                          removeMediaElementOnDestroy: false,
                          hideScrollbar: true,
                          progressColor: props.waveformColor || props.mainColor,
                          waveColor: props.inverted ? waveColorInverted : waveColor,
                          cursorColor: props.inverted ? cursorColorInverted : cursorColor,
                          height: measureRect.current? measureRect.current.height : 90,
                        }} />
          </div>
        }
      </Measure>
    );
  }
  else {
    return null;
  }
}
