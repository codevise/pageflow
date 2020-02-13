import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'heading',
  baseConfiguration: {
    children: 'Some Text'
  },
  variants: [
    {
      name: 'first',
      configuration: {
        first: true
      }
    }
  ]
});
