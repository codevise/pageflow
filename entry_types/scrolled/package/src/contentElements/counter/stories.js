import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';
import {contentElementWidths} from 'pageflow-scrolled/frontend';

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
      name: 'XL Width',
      configuration: {
        width: contentElementWidths.xl
      }
    },
    {
      name: 'Leading Unit',
      configuration: {
        unit: '$',
        unitPlacement: 'leading'
      }
    },
    {
      name: 'Pallete number color',
      themeOptions: {
        properties: {
          root: {
            paletteColorAccent: '#04f'
          }
        }
      },
      configuration: {
        numberColor: 'accent'
      }
    }
  ]
});
