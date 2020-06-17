import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'heading',
  baseConfiguration: {
    children: 'Some Text',
    level: 1
  },
  variants: [
    {
      name: 'First headline in entry',
      configuration: {
        level: 0
      }
    }
  ]
});
