import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineBeforeAfter',
  baseConfiguration: {
    slideMode: 'classic',
    startPos: 0.5
  }
});
