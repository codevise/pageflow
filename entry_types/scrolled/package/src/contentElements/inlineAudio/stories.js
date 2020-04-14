import '../frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineAudio',
  baseConfiguration: {
    id: null,
    autoplay: false,
    controls: false
  }
});
