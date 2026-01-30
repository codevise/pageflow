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
      name: 'Legacy Text Size Large',
      configuration: {
        textSize: 'large',
        targetValue: 7
      }
    },
    {
      name: 'Legacy Text Size Medium',
      configuration: {
        textSize: 'medium'
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
      name: 'Wheel Animation',
      configuration: {
        countingAnimation: 'wheel'
      }
    },
    {
      name: 'Custom Sizes',
      configuration: {
        numberSize: 'xl',
        unitSize: 'sm',
        descriptionSize: 'lg'
      }
    },
    {
      name: 'Separate Colors',
      themeOptions: {
        properties: {
          root: {
            paletteColorAccent: '#04f',
            paletteColorPrimary: '#f40',
            paletteColorSecondary: '#0a0'
          }
        }
      },
      configuration: {
        numberColor: 'accent',
        unitColor: 'primary',
        descriptionColor: 'secondary'
      }
    },
    {
      name: 'Right Aligned',
      configuration: {
        textAlign: 'right'
      }
    }
  ]
});
