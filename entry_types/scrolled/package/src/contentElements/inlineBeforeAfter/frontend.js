import {frontend} from 'pageflow-scrolled/frontend';
import {InlineBeforeAfter} from './InlineBeforeAfter';

frontend.contentElementTypes.register('inlineBeforeAfter', {
  component: InlineBeforeAfter,
  lifecycle: true
});
