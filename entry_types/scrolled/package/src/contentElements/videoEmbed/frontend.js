import {frontend} from 'pageflow-scrolled/frontend';
import {VideoEmbed} from './VideoEmbed';

frontend.contentElementTypes.register('videoEmbed', {
  component: VideoEmbed,
  lifecycle: true
});
