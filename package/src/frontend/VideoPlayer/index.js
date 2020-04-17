
import {VideoPlayer} from './VideoPlayer';

import {useSlimPlayerControlsDuringPhonePlayback} from './useSlimPlayerControlsDuringPhonePlayback';
import {prebuffering} from './prebuffering';
import {bufferUnderrunWaiting} from './bufferUnderrunWaiting';
import {filterSources} from './filterSources';
import {mediaEvents} from './mediaEvents';
import {cueSettingsMethods} from './cueSettingsMethods';
import './dash';

export * from './VideoPlayer';

VideoPlayer.useSlimPlayerControlsDuringPhonePlayback = useSlimPlayerControlsDuringPhonePlayback;
VideoPlayer.prebuffering = prebuffering;
VideoPlayer.filterSources = filterSources;
VideoPlayer.mediaEvents = mediaEvents;
VideoPlayer.cueSettingsMethods = cueSettingsMethods;
VideoPlayer.bufferUnderrunWaiting = bufferUnderrunWaiting;