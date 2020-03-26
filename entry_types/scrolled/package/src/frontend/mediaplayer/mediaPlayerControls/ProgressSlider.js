import React from 'react';
import {DraggableCore} from 'react-draggable';
import Measure from 'react-measure';
import classNames from 'classnames/bind'
import styles from './PlayerControls.module.css';

let cx = classNames.bind(styles)


export const ARROW_LEFT = 37;
export const ARROW_RIGHT = 39;

export default class ProgressSlider extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      handleWidth: null,
      progressHolderWidth: null
    };

    this.measureProgressHolder = (dimensions) => {
      if (dimensions.width &&this.state.progressHolderWidth!==dimensions.width) {
        this.setState((state)=>{
          state.progressHolderWidth = dimensions.width;
          return state;
        });
      }
    };

    this.measureHandle = (dimensions) => {
      if (dimensions.width && this.state.handleWidth!==dimensions.width) {
        this.setState((state)=>{
          state.handleWidth = dimensions.width;
          return state;
        });
      }
    };

    this.handleStop = (mouseEvent, dragEvent) => {
      if (this.props.onSeek) {
        this.props.onSeek(this.positionToTime(dragEvent.x));
      }
    };

    this.handleDrag = (mouseEvent, dragEvent) => {
      if (this.props.onScrub) {
        this.props.onScrub(this.positionToTime(dragEvent.x));
      }
    };

    this.handleKeyDown = (event) => {
      let destination;

      if (event.keyCode == ARROW_LEFT) {
        destination = Math.max(0, this.props.currentTime - 1);
      }
      else if (event.keyCode == ARROW_RIGHT) {
        destination = Math.min(this.props.currentTime + 1, this.props.duration || Infinity);
      }

      if (this.props.onSeek) {
        this.props.onSeek(destination);
      }
    };
  }
  positionToTime(x) {
    if (this.props.duration && this.state.progressHolderWidth) {
      const fraction = Math.max(0, Math.min(1, x / this.state.progressHolderWidth));
      return fraction * this.props.duration;
    }
    else {
      return 0;
    }
  }
  componentDidUpdate(){
    this.measureProgressHolder(this.progressHolderRect);
    this.measureHandle(this.handleRect);
  }
  render() {
    return (
      <div className={cx("vjs-progress-control", styles.progress_control, this.props.styles.progress_control,
                      {progress_control_paused: !this.props.isPlaying})}
           tabIndex="4"
           onKeyDown={this.handleKeyDown}>
        <Measure>
          {(progressMeasure) => {
            if(progressMeasure.contentRect) this.progressHolderRect = progressMeasure.contentRect.entry;
            return (
              <div ref={progressMeasure.measureRef}>
                <DraggableCore onStart={this.handleDrag}
                              onDrag={this.handleDrag}
                              onStop={this.handleStop}>
                  <div className={cx("vjs-progress-holder", styles.progress_holder, this.props.styles.progress_holder)}>
                    <div className={cx("vjs-load-progress", styles.load_progress, this.props.styles.load_progress)} style={{width: toPercent(this.loadProgress())}} />
                    <div className={cx("vjs-play-progress", styles.play_progress, this.props.styles.play_progress)} style={{width: toPercent(this.playProgress())}} />
                    <Measure onMeasure={this.measureHandle}>
                      {(handleMeasure) => {
                        if(handleMeasure.contentRect) this.handleRect = handleMeasure.contentRect.entry;
                        return (
                          <div ref={handleMeasure.measureRef}
                               className={cx("vjs-seek-handle", styles.seek_handle, this.props.styles.seek_handle)}
                               style={{left: this.handlePosition()}} />
                        )
                      }}
                    </Measure>
                  </div>
                </DraggableCore>
              </div>
            )
          }}
        </Measure>
      </div>
    );
  }

  handlePosition() {
    if (this.state.handleWidth && this.state.progressHolderWidth) {
      return ((this.state.progressHolderWidth - this.state.handleWidth) * this.playProgress());
    }
    else {
      return toPercent(this.playProgress());
    }
  }

  loadProgress() {
    return this.props.duration > 0 ? (this.props.bufferedEnd / this.props.duration) : 0;
  }

  playProgress() {
    return this.props.duration > 0 ? (this.props.currentTime / this.props.duration) : 0;
  }
}

ProgressSlider.defaultProps = {
  currentTime: 0,
  bufferedEnd: 0
};

function toPercent(value) {
  return value > 0 ? (value * 100) + '%' : 0;
}
