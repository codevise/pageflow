import {frontend} from 'pageflow-scrolled/frontend';
import {TextBlock} from './TextBlock';

frontend.contentElementTypes.register('textBlock', {
  component: TextBlock,
  customSelectionRect: true,
  inlineComments: true,
  supportsWrappingAroundFloats: true,
  defaultMarginTop: '1.375rem'
});
