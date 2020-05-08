import {handleFailedPlay} from './handleFailedPlay';
import {asyncPlay} from './asyncPlay';
import {hooks} from './hooks';
import {volumeBinding} from './volumeBinding';
import {volumeFading} from './volumeFading';
import {loadWaiting} from './loadWaiting';
import {settings} from '../settings';

import {browser} from '../browser';

export const mediaPlayer = {
  enhance: function(player, options) {
    handleFailedPlay(player, {
      hasAutoplaySupport: browser.has('autoplay support'),
      ...options
    });

    asyncPlay(player);

    if (options.hooks) {
      hooks(player, options.hooks);
    }

    if (options.volumeFading) {
      volumeFading(player);
      volumeBinding(player, settings, options);
    }

    if (options.loadWaiting) {
      loadWaiting(player);
    }
  }
};
