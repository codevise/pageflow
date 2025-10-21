import {frontend} from 'pageflow-scrolled/frontend';
import {SocialEmbed} from './SocialEmbed';

frontend.contentElementTypes.register('socialEmbed', {
  component: SocialEmbed,
  lifecycle: true
});
