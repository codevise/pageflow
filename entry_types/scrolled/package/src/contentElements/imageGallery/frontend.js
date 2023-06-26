import {frontend} from 'pageflow-scrolled/frontend';
import {ImageGallery} from './ImageGallery';

frontend.contentElementTypes.register('imageGallery', {
  component: ImageGallery,
  lifecycle: true,
  customMargin: true
});
