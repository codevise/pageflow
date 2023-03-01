import {frontend} from 'pageflow-scrolled/frontend';
import {Counter} from './Counter';

frontend.contentElementTypes.register('counter', {
  component: Counter,
  lifecycle: true
});
