import {volumeFading} from './volumeFading';

import {interval} from './interval';
import {noop} from './noop';
import {webAudio} from './webAudio';

export * from './volumeFading';

volumeFading.interval = interval;
volumeFading.noop = noop;
volumeFading.webAudio = webAudio;
