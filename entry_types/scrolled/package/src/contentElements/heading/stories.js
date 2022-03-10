import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'heading',
  baseConfiguration: {
    children: 'Some Heading Text',
    level: 1
  },
  variants: [
    {
      name: 'Large',
      configuration: {
        textSize: 'large'
      }
    },
    {
      name: 'Medium',
      configuration: {
        textSize: 'medium'
      }
    },
    {
      name: 'Small',
      configuration: {
        textSize: 'small'
      }
    }
  ]
});
