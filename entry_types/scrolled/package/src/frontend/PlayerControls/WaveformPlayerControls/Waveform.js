import React, {useState, Suspense} from 'react';
import { blankSources } from "pageflow/frontend";
import Measure from 'react-measure';

import styles from './Waveform.module.css';

const waveColor = '#828282ed';
const waveColorInverted = 'rgba(0, 0, 0, 0.5)';

const cursorColor = '#fff';
const cursorColorInverted = '#888';

const Wavesurfer = React.lazy(() => import('./Wavesurfer'));

export function Waveform(props) {
  let isReady = false;
  let mediaElementId = null;
  const [height, setHeight] = useState(90);

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
      <Suspense fallback={<div />}>
        <Measure client onResize={contentRect => setHeight(contentRect.client.height)}>
          {({measureRef}) =>
            <div ref={measureRef} className={styles.waveWrapper}>
              <Wavesurfer mediaElt={`#${props.mediaElementId}`}
                          playing={props.isPlaying}
                          options={{
                            normalize: true,
                            removeMediaElementOnDestroy: false,
                            hideScrollbar: true,
                            progressColor: props.waveformColor || props.mainColor,
                            waveColor: props.inverted ? waveColorInverted : waveColor,
                            cursorColor: props.inverted ? cursorColorInverted : cursorColor,
                            height,
                          }} />
            </div>
          }
        </Measure>
      </Suspense>
    );
  }
  else {
    return null;
  }
}
