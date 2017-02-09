import React from 'react';
import {DraggableCore} from 'react-draggable';
import Measure from 'react-measure';

import {ARROW_LEFT, ARROW_RIGHT} from 'utils/keyCodes';

export default class ProgressSlider extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      handleWidth: null,
      progressHolderWidth: null
    };

    this.measureProgressHolder = ({width}) => {
      this.setState({progressHolderWidth: width});
    };

    this.measureHandle = ({width}) => {
      this.setState({handleWidth: width});
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

      if (this.prop.onSeek) {
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

  render() {
    return (
      <div className="vjs-progress-control"
           tabIndex="4"
           onKeyDown={this.handleKeyDown}>
        <Measure whitelist={['width']} onMeasure={this.measureProgressHolder}>
          <DraggableCore onStart={this.handleDrag}
                         onDrag={this.handleDrag}
                         onStop={this.handleStop}>
            <div className="vjs-progress-holder">
              <div className="vjs-load-progress" style={{width: toPercent(this.loadProgress())}} />
              <div className="vjs-play-progress" style={{width: toPercent(this.playProgress())}} />
              <Measure whitelist={['width']} onMeasure={this.measureHandle}>
                <div className="vjs-seek-handle"
                     style={{left: this.handlePosition()}} />
              </Measure>
            </div>
          </DraggableCore>
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
