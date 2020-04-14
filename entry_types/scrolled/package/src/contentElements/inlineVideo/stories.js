import '../frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineVideo',
  baseConfiguration: {
    id: null,
    autoplay: false,
    controls: false
  }
});
