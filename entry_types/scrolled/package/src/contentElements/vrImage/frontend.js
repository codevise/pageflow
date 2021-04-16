import {frontend} from 'pageflow-scrolled/frontend';
import {VrImage} from './VrImage';

frontend.contentElementTypes.register('vrImage', {
  component: VrImage,
  lifecycle: true
});
