import {browser} from '../../browser';
import {audioContext} from '../../audioContext';

import {webAudio} from './webAudio';
import {noop} from './noop';
import {interval} from './interval'

export const volumeFading = function(player) {
  if (!browser.has('volume control support')) {
    return noop(player);
  }
  else if (browser.has('audio context volume fading support') &&
           audioContext.get() && player.getMediaElement) {
    return webAudio(player, audioContext.get());
  }
  else {
    return interval(player);
  }
};