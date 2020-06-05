import {frontend} from 'pageflow-scrolled/frontend';
import {InlineAudio} from './InlineAudio';

frontend.contentElementTypes.register('inlineAudio', {
  component: InlineAudio,
  lifecycle: true
});
