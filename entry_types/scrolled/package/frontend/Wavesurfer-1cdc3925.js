import React, { Component } from 'react';
import { b as _inherits, a as _classCallCheck, c as _getPrototypeOf, d as _possibleConstructorReturn, e as _isNativeReflectConstruct, f as _assertThisInitialized, _ as _createClass } from './inherits-539844a6.js';
import Measure from 'react-measure';
import assign from 'deep-assign';
import WaveSurfer from 'wavesurfer.js';

function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
var EVENTS = ['audioprocess', 'error', 'finish', 'loading', 'mouseup', 'pause', 'play', 'ready', 'scroll', 'seek', 'zoom'];
function capitaliseFirstLetter(string) {
  return string.split('-').map(function (part) {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('');
}
var Wavesurfer = /*#__PURE__*/function (_Component) {
  _inherits(Wavesurfer, _Component);
  function Wavesurfer(props) {
    var _this;
    _classCallCheck(this, Wavesurfer);
    _this = _callSuper(this, Wavesurfer, [props]);
    _this.state = {
      isReady: false
    };
    if (typeof WaveSurfer === undefined) {
      throw new Error('WaveSurfer is undefined!');
    }
    _this._loadMediaElt = _this._loadMediaElt.bind(_assertThisInitialized(_this));
    _this._loadAudio = _this._loadAudio.bind(_assertThisInitialized(_this));
    _this._seekTo = _this._seekTo.bind(_assertThisInitialized(_this));
    _this._handleResize = function () {
      if (_this.state.isReady) {
        // Force redraw
        _this._wavesurfer.zoom(false);
      }
    };
    return _this;
  }
  _createClass(Wavesurfer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      var options = assign({}, this.props.options, {
        container: this.wavesurferEl
      });

      // media element loading is only supported by MediaElement backend
      if (this.props.mediaElt) {
        options.backend = 'MediaElement';
      }
      this._wavesurfer = WaveSurfer.create(options);

      // file was loaded, wave was drawn
      this._wavesurfer.on('ready', function () {
        _this2.setState({
          isReady: true,
          pos: _this2.props.pos
        });

        // set initial position
        if (_this2.props.pos) {
          _this2._seekTo(_this2.props.pos);
        }

        // set initial volume
        if (_this2.props.volume != null) {
          _this2._wavesurfer.setVolume(_this2.props.volume);
        }

        // set initial playing state
        if (_this2.props.playing) {
          _this2._wavesurfer.play();
        }

        // set initial zoom
        if (_this2.props.zoom) {
          _this2._wavesurfer.zoom(_this2.props.zoom);
        }
      });
      this._wavesurfer.on('audioprocess', function (pos) {
        _this2.setState({
          pos: pos
        });
        _this2.props.onPosChange({
          wavesurfer: _this2._wavesurfer,
          originalArgs: [pos]
        });
      });

      // `audioprocess` is not fired when seeking, so we have to plug into the
      // `seek` event and calculate the equivalent in seconds (seek event
      // receives a position float 0-1) – See the README.md for explanation why we
      // need this
      this._wavesurfer.on('seek', function (pos) {
        var formattedPos = _this2._posToSec(pos);
        _this2.setState({
          formattedPos: formattedPos
        });
        _this2.props.onPosChange({
          wavesurfer: _this2._wavesurfer,
          originalArgs: [formattedPos]
        });
      });

      // hook up events to callback handlers passed in as props
      EVENTS.forEach(function (e) {
        var propCallback = _this2.props["on".concat(capitaliseFirstLetter(e))];
        var wavesurfer = _this2._wavesurfer;
        if (propCallback) {
          _this2._wavesurfer.on(e, function () {
            for (var _len = arguments.length, originalArgs = new Array(_len), _key = 0; _key < _len; _key++) {
              originalArgs[_key] = arguments[_key];
            }
            propCallback({
              wavesurfer: wavesurfer,
              originalArgs: originalArgs
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
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // update audioFile
      if (prevProps.audioFile !== this.props.audioFile) {
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
      if (this.props.pos && this.state.isReady && prevProps.pos !== this.props.pos && this.props.pos !== this.state.pos) {
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
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this3 = this;
      // remove listeners
      EVENTS.forEach(function (e) {
        _this3._wavesurfer.un(e);
      });

      // destroy wavesurfer instance
      this._wavesurfer.destroy();
    }

    // receives seconds and transforms this to the position as a float 0-1
  }, {
    key: "_secToPos",
    value: function _secToPos(sec) {
      return 1 / this._wavesurfer.getDuration() * sec;
    }

    // receives position as a float 0-1 and transforms this to seconds
  }, {
    key: "_posToSec",
    value: function _posToSec(pos) {
      return pos * this._wavesurfer.getDuration();
    }

    // pos is in seconds, the 0-1 proportional position we calculate here …
  }, {
    key: "_seekTo",
    value: function _seekTo(sec) {
      var pos = this._secToPos(sec);
      if (this.props.options.autoCenter) {
        this._wavesurfer.seekAndCenter(pos);
      } else {
        this._wavesurfer.seekTo(pos);
      }
    }

    // load a media element selector or HTML element
    // if selector, get the HTML element for it
    // and pass to _loadAudio
  }, {
    key: "_loadMediaElt",
    value: function _loadMediaElt(selectorOrElt, audioPeaks) {
      if (selectorOrElt instanceof global.HTMLElement) {
        this._loadAudio(selectorOrElt, audioPeaks);
      } else {
        // Ignore if media element cannot be found. There are edge cases
        // where React already unmounted the corresponding media element,
        // but the parent Waveform component still holds the old media
        // element id.
        if (global.document.querySelector(selectorOrElt)) {
          this._loadAudio(global.document.querySelector(selectorOrElt), audioPeaks);
        }
      }
    }

    // pass audio data to wavesurfer
  }, {
    key: "_loadAudio",
    value: function _loadAudio(audioFileOrElt, audioPeaks) {
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
        throw new Error("Wavesurfer._loadAudio expects prop audioFile\n        to be either HTMLElement, string or file/blob");
      }
    }
  }, {
    key: "_measureIfResponsive",
    value: function _measureIfResponsive(children) {
      if (this.props.responsive) {
        return /*#__PURE__*/React.createElement(Measure, {
          client: true,
          onResize: this._handleResize
        }, function (_ref) {
          var measureRef = _ref.measureRef;
          return /*#__PURE__*/React.createElement("div", {
            ref: measureRef
          }, children);
        });
      }
      return children;
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var childrenWithProps = this.props.children ? React.Children.map(this.props.children, function (child) {
        return React.cloneElement(child, {
          wavesurfer: _this4._wavesurfer,
          isReady: _this4.state.isReady
        });
      }) : false;
      return this._measureIfResponsive( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        ref: function ref(c) {
          _this4.wavesurferEl = c;
        }
      }), childrenWithProps));
    }
  }]);
  return Wavesurfer;
}(Component);
Wavesurfer.defaultProps = {
  playing: false,
  pos: 0,
  options: WaveSurfer.defaultParams,
  responsive: true,
  onPosChange: function onPosChange() {}
};

export default Wavesurfer;
