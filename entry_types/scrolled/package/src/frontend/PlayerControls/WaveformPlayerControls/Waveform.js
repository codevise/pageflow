import React, {useState, Suspense} from 'react';
import Measure from 'react-measure';

import {RemotePeakData} from './RemotePeakData';

import styles from './Waveform.module.css';

const waveColor = '#828282ed';
const waveColorInverted = 'rgba(0, 0, 0, 0.5)';

const cursorColor = '#fff';
const cursorColorInverted = '#888';

const Wavesurfer = React.lazy(() => import('./Wavesurfer'));

const waveformStyles = {
  waveformLines: {
    barWidth: 1,
    barGap: 2
  },
  waveformBars: {
    barWidth: 3,
    barRadius: 3,
    barGap: 3
  }
};

export function Waveform(props) {
  const [height, setHeight] = useState(90);

  if (props.mediaElementId) {
    return (
      <Suspense fallback={<div />}>
        <Measure client onResize={contentRect => setHeight(contentRect.client.height)}>
          {({measureRef}) =>
            <div ref={measureRef} className={styles.waveWrapper}>
              <RemotePeakData audioFile={props.audioFile}>
                {peakData =>
                  <Wavesurfer key={props.variant}
                              mediaElt={`#${props.mediaElementId}`}
                              audioPeaks={peakData}
                              options={{
                                ...waveformStyles[props.variant],
                                normalize: true,
                                removeMediaElementOnDestroy: false,
                                hideScrollbar: true,
                                progressColor: props.waveformColor ||
                                               props.mainColor,
                                waveColor: props.inverted ?
                                           waveColorInverted :
                                           waveColor,
                                cursorColor: props.inverted ?
                                             cursorColorInverted :
                                             cursorColor,
                                height,
                              }} />
                }
              </RemotePeakData>
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
