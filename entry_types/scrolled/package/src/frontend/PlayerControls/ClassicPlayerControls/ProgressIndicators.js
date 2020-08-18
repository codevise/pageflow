import React, {useState, useCallback, useRef} from 'react';
import {DraggableCore} from 'react-draggable';
import Measure from 'react-measure';
import classNames from 'classnames';

import {useI18n} from '../../i18n';
import {formatTime} from '../formatTime';

import styles from './ProgressIndicators.module.css';

export function ProgressIndicators({currentTime, duration, bufferedEnd, scrubTo, seekTo}) {
  const {t} = useI18n();
  const [dragging, setDragging] = useState();
  const progressBarsContainerWidth = useRef();

  const positionToTime = useCallback((x) => {
    if (duration && progressBarsContainerWidth.current) {
      const fraction = Math.max(0, Math.min(1, x / progressBarsContainerWidth.current));
      return fraction * duration;
    } else {
      return 0;
    }
  }, [duration]);

  const handleStop = useCallback((mouseEvent, dragEvent) => {
    setDragging(false);
    seekTo(positionToTime(dragEvent.x));
  }, [seekTo, positionToTime]);

  const handleDrag = useCallback((mouseEvent, dragEvent) => {
    setDragging(true);
    scrubTo(positionToTime(dragEvent.x));
  }, [scrubTo, positionToTime]);

  const handleKeyDown = useCallback(event => {
    let destination;

    if (event.key === 'ArrowLeft') {
      destination = Math.max(0, currentTime - 1);
    }
    else if (event.key === 'ArrowRight') {
      destination = Math.min(currentTime + 1, duration || Infinity);
    }

    seekTo(destination);
  }, [seekTo, currentTime, duration]);

  const loadProgress = duration > 0 ? Math.min(1, bufferedEnd / duration) : 0;
  const playProgress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <div className={classNames(styles.container, {[styles.dragging]: dragging})}
         aria-label={t('pageflow_scrolled.public.player_controls.progress', {
             currentTime: formatTime(currentTime),
             duration: formatTime(duration)
           })}
         onKeyDown={handleKeyDown}
         tabIndex="0">
      <div className={styles.wrapper}>
        <Measure client
                 onResize={contentRect => progressBarsContainerWidth.current = contentRect.client.width}>
          {({measureRef}) =>
            <DraggableCore onStart={handleDrag}
                           onDrag={handleDrag}
                           onStop={handleStop}>
              <div className={classNames(styles.draggable)}>
                <div ref={measureRef} className={styles.bars}>
                  <div className={styles.background} />
                  <div className={styles.loadingProgressBar}
                       style={{width: toPercent(loadProgress)}}
                       data-testid="loading-progress-bar"/>
                  <div className={styles.playProgressBar}
                       style={{width: toPercent(playProgress)}}
                       data-testid="play-progress-bar"/>
                  <div className={styles.sliderHandle}
                       style={{left: toPercent(playProgress)}}
                       data-testid="slider-handle"/>
                </div>
              </div>
            </DraggableCore>
          }
        </Measure>
      </div>
    </div>
  );
}

function toPercent(value) {
  return value > 0 ? (value * 100) + '%' : 0;
}
