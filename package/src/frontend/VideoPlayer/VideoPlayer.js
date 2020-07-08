
import {filterSources} from './filterSources';
import {useSlimPlayerControlsDuringPhonePlayback} from './useSlimPlayerControlsDuringPhonePlayback';
import {prebuffering} from './prebuffering';
import {cueSettingsMethods} from './cueSettingsMethods';
import {getMediaElementMethod} from './getMediaElementMethod';
import {mediaPlayer} from '../mediaPlayer';
import {mediaEvents} from './mediaEvents';
import {bufferUnderrunWaiting} from './bufferUnderrunWaiting';
import {rewindMethod} from './rewindMethod';

import VideoJS from 'videojs';

export const VideoPlayer = function(element, options) {
  options = options || {};

  element = filterSources(element);
  var player = VideoJS(element, options);

  if (options.useSlimPlayerControlsDuringPhonePlayback) {
    useSlimPlayerControlsDuringPhonePlayback(player);
  }

  prebuffering(player);
  cueSettingsMethods(player);
  getMediaElementMethod(player);
  rewindMethod(player);

  if (options.mediaEvents) {
    mediaEvents(player, options.context);
  }

  if (options.bufferUnderrunWaiting) {
    bufferUnderrunWaiting(player);
  }

  mediaPlayer.enhance(player, options);

  return player;
};
