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
      name: 'First headline in entry',
      configuration: {
        level: 0
      }
    },
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
    },
    {
      name: 'With custom content text colors',
      themeOptions: {
        properties: {
          headings: {
            lightContentTextColor: 'red'
          }
        }
      }
    },
    {
      name: 'With custom content text colors in inverted section',
      sectionConfiguration: {
        invert: true
      },
      themeOptions: {
        properties: {
          headings: {
            darkContentTextColor: 'red'
          }
        }
      }
    },
    {
      name: 'Palette Color',
      themeOptions: {
        properties: {
          root: {
            paletteColorAccent: '#04f'
          }
        }
      },
      configuration: {
        color: 'accent'
      }
    }
  ]
});
