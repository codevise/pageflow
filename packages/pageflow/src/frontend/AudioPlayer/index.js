
import {AudioPlayer} from './AudioPlayer';
import {mediaEvents} from './mediaEvents';
import {Null} from './Null';
import {seekWithInvalidStateHandling} from './seekWithInvalidStateHandling';
import {rewindMethod} from './rewindMethod';
import {pauseInBackground} from './pauseInBackground';

export * from './AudioPlayer';

AudioPlayer.mediaEvents = mediaEvents;
AudioPlayer.Null = Null;
AudioPlayer.seekWithInvalidStateHandling = seekWithInvalidStateHandling;
AudioPlayer.rewindMethod = rewindMethod;
AudioPlayer.pauseInBackground = pauseInBackground;
