import {frontend} from 'pageflow-scrolled/frontend';
import {InlineVideo} from './InlineVideo';

frontend.contentElementTypes.register('inlineVideo', {
  component: InlineVideo,
  lifecycle: true
});
