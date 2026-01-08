import {frontend} from 'pageflow-scrolled/frontend';
import {Question} from './Question';

frontend.contentElementTypes.register('question', {
  component: Question,
  defaultMarginTop: '1.375rem'
});
