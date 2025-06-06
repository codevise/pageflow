import {frontend} from 'pageflow-scrolled/frontend';
import {ExternalLinkList} from './ExternalLinkList';

frontend.contentElementTypes.register('externalLinkList', {
  component: ExternalLinkList,

  customMargin({configuration}) {
    return configuration.enableScroller === 'always'
  },

  lifecycle: true
});
