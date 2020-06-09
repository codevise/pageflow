import {frontend} from 'pageflow-scrolled/frontend';
import {InlineImage} from './InlineImage';

frontend.contentElementTypes.register('inlineImage', {
  component: InlineImage,
  lifecycle: true
});
