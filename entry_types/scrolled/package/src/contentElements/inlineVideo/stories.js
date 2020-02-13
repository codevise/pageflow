import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineVideo',
  baseConfiguration: {
    id: 'videoGarzweilerDrohne',
    autoplay: false,
    controls: true
  }
});
