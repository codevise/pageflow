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
      name: 'With Default Grouping',
      configuration: {
        targetValue: 2000,
        startValue: 1000,
        unit: 'kg',
        description: [],
        textSize: 'small'
      }
    },
    {
      name: 'Without Grouping',
      configuration: {
        targetValue: 2025,
        startValue: 2020,
        hideThousandsSeparators: true,
        unit: '',
        description: []
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
    },
    {
      name: 'Custom typography',
      configuration: {
        textSize: 'small'
      },
      themeOptions: {
        typography: {
          counterNumberSm: {
            fontSize: '40px'
          },
          counterDescriptionSm: {
            fontSize: '18px'
          }
        }
      }
    }
  ]
});
