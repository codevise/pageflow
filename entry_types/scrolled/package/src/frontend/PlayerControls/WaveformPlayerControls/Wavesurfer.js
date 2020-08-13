import React, { Component } from 'react';
import PropTypes from 'prop-types';
import assign from 'deep-assign';
import Measure from 'react-measure';

import WaveSurfer from 'wavesurfer.js';

const EVENTS = [
  'audioprocess',
  'error',
  'finish',
  'loading',
  'mouseup',
  'pause',
  'play',
  'ready',
  'scroll', 
  'seek',
  'zoom'
];

/**
 * @description Capitalise the first letter of a string
 */
function capitaliseFirstLetter(string) {
  return string.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

/**
 * @description Throws an error if the prop is defined and not an integer or not positive
 */
function positiveIntegerProptype(props, propName, componentName) {
  const n = props[propName];
  if (n !== undefined && (typeof n !== 'number' || n !== parseInt(n, 10) || n < 0)) {
    return new Error(`Invalid ${propName} supplied to ${componentName},
      expected a positive integer`);
  }

  return null;
}

class Wavesurfer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false
    };

    if (typeof WaveSurfer === undefined) {
      throw new Error('WaveSurfer is undefined!');
    }

    this._wavesurfer = Object.create(WaveSurfer);
    this._loadMediaElt = this._loadMediaElt.bind(this);
    this._loadAudio = this._loadAudio.bind(this);
    this._seekTo = this._seekTo.bind(this);

    this._handleResize = () => {
      if (this.state.isReady) {
        this._wavesurfer.refresh();
      }
    };
  }

  componentDidMount() {
    const options = assign({}, this.props.options, {
      container: this.wavesurferEl
    });

    // media element loading is only supported by MediaElement backend
    if (this.props.mediaElt) {
      options.backend = 'MediaElement';
    }

    this._wavesurfer.init(options);

    // file was loaded, wave was drawn
    this._wavesurfer.on('ready', () => {
      this.setState({
        isReady: true,
        pos: this.props.pos
      });

      // set initial position
      if (this.props.pos) {
        this._seekTo(this.props.pos);
      }

      // set initial volume
      if (this.props.volume != null) {
        this._wavesurfer.setVolume(this.props.volume);
      }

      // set initial playing state
      if (this.props.playing) {
        this.wavesurfer.play();
      }

      // set initial zoom
      if (this.props.zoom) {
        this._wavesurfer.zoom(this.props.zoom);
      }
    });

    this._wavesurfer.on('audioprocess', (pos) => {
      this.setState({
        pos
      });
      this.props.onPosChange({
        wavesurfer: this._wavesurfer,
        originalArgs: [pos]
      });
    });

    // `audioprocess` is not fired when seeking, so we have to plug into the
    // `seek` event and calculate the equivalent in seconds (seek event
    // receives a position float 0-1) – See the README.md for explanation why we
    // need this
    this._wavesurfer.on('seek', (pos) => {
      const formattedPos = this._posToSec(pos);
      this.setState({
        formattedPos
      });
      this.props.onPosChange({
        wavesurfer: this._wavesurfer,
        originalArgs: [formattedPos]
      });
    });

    // hook up events to callback handlers passed in as props
    EVENTS.forEach((e) => {
      const propCallback = this.props[`on${capitaliseFirstLetter(e)}`];
      const wavesurfer = this._wavesurfer;
      if (propCallback) {
        this._wavesurfer.on(e, (...originalArgs) => {
          propCallback({
            wavesurfer,
            originalArgs
          });
        });
      }
    });

    // if audioFile prop, load file
    if (this.props.audioFile) {
      this._loadAudio(this.props.audioFile, this.props.audioPeaks);
    }

    // if mediaElt prop, load media Element
    if (this.props.mediaElt) {
      this._loadMediaElt(this.props.mediaElt, this.props.audioPeaks);
    }
  }

  // update wavesurfer rendering manually
  componentDidUpdate(prevProps) {
    // update audioFile
    if (this.props.audioFile !== this.props.audioFile) {
      this._loadAudio(this.props.audioFile, this.props.audioPeaks);
    }

    // update mediaElt
    if (prevProps.mediaElt !== this.props.mediaElt) {
      this._loadMediaElt(this.props.mediaElt, this.props.audioPeaks);
    }

    // update peaks
    if (prevProps.audioPeaks !== this.props.audioPeaks) {
      if (this.props.mediaElt) {
        this._loadMediaElt(prevProps.mediaElt, this.props.audioPeaks);
      } else {
        this._loadAudio(this.props.audioFile, this.props.audioPeaks);
      }
    }

    // update position
    if (this.props.pos &&
        this.state.isReady &&
        prevProps.pos !== this.props.pos &&
        this.props.pos !== this.state.pos) {
      this._seekTo(this.props.pos);
    }

    // update playing state
    if (this.props.playing !== prevProps.playing) {
      if (this.props.playing) {
        this._wavesurfer.play();
      } else {
        this._wavesurfer.pause();
      }
    }

    // update volume
    if (this.props.volume !== prevProps.volume) {
      this._wavesurfer.setVolume(this.props.volume);
    }

    // update volume
    if (this.props.zoom !== prevProps.zoom) {
      this._wavesurfer.zoom(this.props.zoom);
    }

    // update audioRate
    if (this.props.options.audioRate !== prevProps.options.audioRate) {
      this._wavesurfer.setPlaybackRate(this.props.options.audioRate);
    }

    if (prevProps.options.waveColor !== this.props.options.waveColor) {
      this._wavesurfer.setWaveColor(this.props.options.waveColor);
    }

    if (prevProps.options.progressColor !== this.props.options.progressColor) {
      this._wavesurfer.setProgressColor(this.props.options.progressColor);
    }

    if (prevProps.options.cursorColor !== this.props.options.cursorColor) {
      this._wavesurfer.setCursorColor(this.props.options.cursorColor);
    }

    if (prevProps.options.height !== this.props.options.height) {
      this._wavesurfer.setHeight(this.props.options.height);
    }
  }

  componentWillUnmount() {
    // remove listeners
    EVENTS.forEach((e) => {
      this._wavesurfer.un(e);
    });

    // destroy wavesurfer instance
    this._wavesurfer.destroy();
  }

  // receives seconds and transforms this to the position as a float 0-1
  _secToPos(sec) {
    return (1 / this._wavesurfer.getDuration()) * sec;
  }

  // receives position as a float 0-1 and transforms this to seconds
  _posToSec(pos) {
    return pos * this._wavesurfer.getDuration();
  }

  // pos is in seconds, the 0-1 proportional position we calculate here …
  _seekTo(sec) {
    const pos = this._secToPos(sec);
    if (this.props.options.autoCenter) {
      this._wavesurfer.seekAndCenter(pos);
    } else {
      this._wavesurfer.seekTo(pos);
    }
  }

  // load a media element selector or HTML element
  // if selector, get the HTML element for it
  // and pass to _loadAudio
  _loadMediaElt(selectorOrElt, audioPeaks) {
    if (selectorOrElt instanceof global.HTMLElement) {
      this._loadAudio(selectorOrElt, audioPeaks);
    } else {
      if (!global.document.querySelector(selectorOrElt)) {
        throw new Error('Media Element not found!');
      }

      this._loadAudio(global.document.querySelector(selectorOrElt), audioPeaks);
    }
  }

  // pass audio data to wavesurfer
  _loadAudio(audioFileOrElt, audioPeaks) {
    if (audioFileOrElt instanceof global.HTMLElement) {
      // media element
      this._wavesurfer.loadMediaElement(audioFileOrElt, audioPeaks);
    } else if (typeof audioFileOrElt === 'string') {
      // bog-standard string is handled by load method and ajax call
      this._wavesurfer.load(audioFileOrElt, audioPeaks);
    } else if (audioFileOrElt instanceof global.Blob || audioFileOrElt instanceof global.File) {
      // blob or file is loaded with loadBlob method
      this._wavesurfer.loadBlob(audioFileOrElt, audioPeaks);
    } else {
      throw new Error(`Wavesurfer._loadAudio expects prop audioFile
        to be either HTMLElement, string or file/blob`);
    }
  }

  _measureIfResponsive(children) {
    if (this.props.responsive) {
      return (
        <Measure client onResize={this._handleResize}>
          {({ measureRef }) => (
            <div ref={measureRef}>
              {children}
            </div>
          )

          }
        </Measure>
      );
    }

    return children;
  }

  render() {
    const childrenWithProps = (this.props.children)
      ? React.Children.map(
        this.props.children,
        child => React.cloneElement(child, {
          wavesurfer: this._wavesurfer,
          isReady: this.state.isReady
        }))
      : false;

    return this._measureIfResponsive(
      <div>
        <div ref={(c) => { this.wavesurferEl = c; }} />
        {childrenWithProps}
      </div>
    );
  }
}

Wavesurfer.propTypes = {
  playing: PropTypes.bool,
  pos: PropTypes.number,
  audioFile: (props, propName, componentName) => {
    const prop = props[propName];
    if (prop &&
        typeof prop !== 'string' &&
        !(prop instanceof global.Blob) &&
        !(prop instanceof global.File)) {
      return new Error(`Invalid ${propName} supplied to ${componentName}
        expected either string or file/blob`);
    }

    return null;
  },

  mediaElt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(global.HTMLElement)
  ]),
  audioPeaks: PropTypes.array,
  volume: PropTypes.number,
  zoom: PropTypes.number,
  responsive: PropTypes.bool,
  onPosChange: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ]),
  options: PropTypes.shape({
    audioRate: PropTypes.number,
    backend: PropTypes.oneOf(['WebAudio', 'MediaElement']),
    barWidth: (props, propName, componentName) => {
      const prop = props[propName];
      if (prop !== undefined && typeof prop !== 'number') {
        return new Error(`Invalid ${propName} supplied to ${componentName}
          expected either undefined or number`);
      }

      return null;
    },

    cursorColor: PropTypes.string,
    cursorWidth: positiveIntegerProptype,
    dragSelection: PropTypes.bool,
    fillParent: PropTypes.bool,
    height: positiveIntegerProptype,
    hideScrollbar: PropTypes.bool,
    interact: PropTypes.bool,
    loopSelection: PropTypes.bool,
    mediaControls: PropTypes.bool,
    minPxPerSec: positiveIntegerProptype,
    normalize: PropTypes.bool,
    pixelRatio: PropTypes.number,
    progressColor: PropTypes.string,
    scrollParent: PropTypes.bool,
    skipLength: PropTypes.number,
    waveColor: PropTypes.string,
    autoCenter: PropTypes.bool
  })
};

Wavesurfer.defaultProps = {
  playing: false,
  pos: 0,
  options: WaveSurfer.defaultParams,
  responsive: true,
  onPosChange: () => {}
};

export default Wavesurfer;
