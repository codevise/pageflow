import React from 'react';
import {DraggableCore} from 'react-draggable';
import classNames from 'classnames';

import styles from './ProgressIndicators.module.css';

export class ProgressIndicators extends React.Component {

  loadProgress() {
    return this.props.duration > 0 ? (this.props.bufferedEnd / this.props.duration) : 0;
  }

  playProgress() {
    return this.props.duration > 0 ? (this.props.currentTime / this.props.duration) : 0;
  }

  handlePosition() {
    return toPercent(this.playProgress());
  }

  render() {
    return (
      <div className={classNames(styles.progressIndicatorsContainer)}>
        <div className={classNames(styles.progressBarsContainer)}>
          <div className={classNames(styles.progressBar, styles.loadingProgressBar)}
               style={{width: toPercent(this.loadProgress())}} />
          <div className={classNames(styles.progressBar, styles.playProgressBar)}
               style={{width: toPercent(this.playProgress())}} />
          <div className={classNames(styles.sliderHandle)}
               style={{left: this.handlePosition()}} />
        </div>
      </div>
    );
  }
}

ProgressIndicators.defaultProps = {
  duration: 8000,
  currentTime: 0,
  bufferedEnd: 0
};

function toPercent(value) {
  return value > 0 ? (value * 100) + '%' : 0;
}