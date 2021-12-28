import {frontend} from 'pageflow-scrolled/frontend';
import {IframeEmbed} from './IframeEmbed';

frontend.contentElementTypes.register('iframeEmbed', {
  component: IframeEmbed,
  lifecycle: true
});
