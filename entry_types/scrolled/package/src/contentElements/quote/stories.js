import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'quote',
  baseConfiguration: {
    text: [
      {
        type: 'paragraph',
        children: [{text: 'Be the change that you wish to see in the world.'}]
      }
    ],
    attribution: [
      {
        type: 'paragraph',
        children: [{text: 'Mahatma Gandhi'}]
      },
      {
        type: 'paragraph',
        children: [{text: '1869–1948'}]
      }
    ]
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
