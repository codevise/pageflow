
import {mediaPlayer} from './mediaPlayer';

import {handleFailedPlay} from './handleFailedPlay';
import {volumeFading} from './volumeFading';
import {volumeBinding} from './volumeBinding';
import {loadWaiting} from './loadWaiting';
import {hooks} from './hooks';
import {asyncPlay} from './asyncPlay';

export * from './mediaPlayer';

mediaPlayer.handleFailedPlay = handleFailedPlay;
mediaPlayer.volumeBinding = volumeBinding;
mediaPlayer.volumeFading = volumeFading;
mediaPlayer.loadWaiting = loadWaiting;
mediaPlayer.hooks = hooks;
mediaPlayer.asyncPlay = asyncPlay;