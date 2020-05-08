import {mediaPlayer} from '../mediaPlayer';
import {browser} from '../browser';
import {mediaEvents} from './mediaEvents';
import {pauseInBackground} from './pauseInBackground';
import {seekWithInvalidStateHandling} from './seekWithInvalidStateHandling';
import {rewindMethod} from './rewindMethod';
import {getMediaElementMethod} from './getMediaElementMethod';
import {assetUrls} from '../assetUrls';

/**
 * Playing audio sources
 *
 * @param {Object[]} sources
 * List of sources for audio element.
 *
 * @param {string} sources[].type
 * Mime type of the audio.
 *
 * @param {string} sources[].src
 * Url of the audio.
 *
 * @class
 */
export const AudioPlayer = function(sources, options) {
  options = options || {};

  var codecMapping = {
    vorbis: 'audio/ogg',
    mp4: 'audio/mp4',
    mp3: 'audio/mpeg'
  };

  let readyResolve;
  let readyPromise = new Promise(function(resolve) {
    readyResolve = resolve;
  });

  let loadedResolve;
  let loadedPromise = new Promise(function(resolve) {
    loadedResolve = resolve;
  });

  var audio = new Audio5js({
    reusedTag: options.tag,
    swf_path: assetUrls.audioSwf,
    throw_errors: false,
    format_time: false,
    codecs: options.codecs || ['vorbis', 'mp4', 'mp3'],
    ready: readyResolve,
    loop: options.loop
  });

  audio.readyPromise = readyPromise;
  audio.loadedPromise = loadedPromise;

  audio.on('load', loadedResolve);

  if (options.mediaEvents) {
    mediaEvents(audio, options.context);
  }

  if (options.pauseInBackground && browser.has('mobile platform')) {
    pauseInBackground(audio);
  }

  mediaPlayer.enhance(audio, {
    loadWaiting: true,
    ...options
  });

  seekWithInvalidStateHandling(audio);
  rewindMethod(audio);
  getMediaElementMethod(audio);

  audio.src = function(sources) {
    readyPromise.then(function() {
      var source = (sources || []).find(function(source) {
        return (codecMapping[audio.settings.player.codec] === source.type);
      });

      audio.load(source ? source.src : '');
    });
  };

  var originalLoad = audio.load;
  audio.load = function(src) {
    if (!src) {
      this.duration = 0;
    }

    this.currentSrc = src;
    this.position = 0;
    this.trigger('timeupdate', this.position, this.duration);

    originalLoad.apply(this, arguments);
  };

  var originalSeek = audio.seek;
  audio.seek = function() {
    if (this.currentSrc) {
      return originalSeek.apply(this, arguments);
    }
  };

  var originalPlay = audio.play;
  audio.play = function() {
    if (this.currentSrc) {
      originalPlay.apply(this, arguments);
    }
  };

  audio.paused = function() {
    return !audio.playing;
  };

  audio.src(sources);
  return audio;
};

AudioPlayer.fromAudioTag = function(element, options) {
  return new AudioPlayer(element.find('source').map(function() {
    return {
      src: this.getAttribute('src'),
      type: this.getAttribute('type')
    };
  }).get(), {tag: element[0], ...options});
};

AudioPlayer.fromScriptTag = function(element, options) {
  var sources = element.length ? JSON.parse(element.text()) : [];
  return new AudioPlayer(sources, options);
};
