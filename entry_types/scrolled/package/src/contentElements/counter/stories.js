import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'counter',
  baseConfiguration: {
    targetValue: 75,
    startValue: 50,
    unit: '%',
    description: [
      {
        type: 'paragraph',
        children: [{text: 'more awesome'}]
      },
      {
        type: 'paragraph',
        children: [{text: 'than before'}]
      }
    ]
  },
  variants: [
    {
      name: 'Large',
      configuration: {
        textSize: 'large',
        targetValue: 7
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
    },
    {
      name: 'Position Wide',
      configuration: {
        position: 'wide'
      }
    },
    {
      name: 'Leading Unit',
      configuration: {
        unit: '$',
        unitPlacement: 'leading'
      }
    }
  ]
});
