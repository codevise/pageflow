import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

const linkExampleConfiguration = {
  value: [
    {
      type: 'paragraph',
      children: [
        {
          "text": "This is a "
        },
        {
          "type": "link",
          "href": "https://example.com",
          "children": [
            {
              "text": "link"
            }
          ]
        }
      ]
    }
  ]
};

storiesOfContentElement(module, {
  typeName: 'textBlock',
  baseConfiguration: {
    value: [
      {
        type: 'heading',
        children: [
          {text: 'Heading'}
        ]
      },
      {
        type: 'paragraph',
        children: [
          {text: 'At', bold: true},
          {text: ' '},
          {text: 'vero', underline: true},
          {text: ' eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. '},
          {
            "text": "This is a "
          },
          {
            "type": "link",
            "href": "https://example.com",
            "children": [
              {
                "text": "link"
              }
            ]
          }
        ]
      },
      {
        type: 'block-quote',
        children: [
          {text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.'}
        ]
      },
      {
        type: 'paragraph',
        children: [
          {text: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'}
        ]
      },
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [
              {text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'}
            ]
          },
          {
            type: 'list-item',
            children: [
              {text: 'Sed diam nonumy eirmod tempor invidunt ut labore et dolore.'}
            ]
          }
        ]
      },
      {
        type: 'paragraph',
        children: [
          {text: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'}
        ]
      },
      {
        type: 'numbered-list',
        children: [
          {
            type: 'list-item',
            children: [
              {text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'}
            ]
          },
          {
            type: 'list-item',
            children: [
              {text: 'Sed diam nonumy eirmod tempor invidunt ut labore et dolore.'}
            ]
          }
        ]
      }
    ]
  },
  variants: [
    {
      name: 'Palette color',
      themeOptions: {
        properties: {
          root: {
            paletteColorAccent: '#04f'
          }
        }
      },
      configuration: {
        value: [
          {
            type: 'heading',
            color: 'accent',
            children: [
              {text: 'Heading'}
            ]
          },
          {
            type: 'paragraph',
            color: 'accent',
            children: [
              {text: 'Some paragraph'},
            ]
          }
        ]
      }
    },
    {
      name: 'Text align justify',
      configuration: {
        value: [
          {
            type: 'heading',
            textAlign: 'justify',
            children: [
              {text: 'Heading'}
            ]
          },
          {
            type: 'paragraph',
            textAlign: 'justify',
            children: [
              {text: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'},
            ]
          }
        ]
      }
    },
    {
      name: 'With theme link color',
      configuration: linkExampleConfiguration,
      themeOptions: {
        properties: {
          root: {
            contentLinkColor: 'red'
          }
        }
      }
    },
    {
      name: 'With theme light link color',
      configuration: linkExampleConfiguration,
      themeOptions: {
        properties: {
          root: {
            lightContentLinkColor: 'yellow',
            darkContentLinkColor: 'green',
          }
        }
      }
    },
    {
      name: 'With theme dark link color in inverted section',
      configuration: linkExampleConfiguration,
      sectionConfiguration: {
        invert: true
      },
      themeOptions: {
        properties: {
          root: {
            lightContentLinkColor: 'yellow',
            darkContentLinkColor: 'green',
          }
        }
      }
    },
    {
      name: 'With customized hanging quotes',
      themeOptions: {
        quoteDesign: 'hanging',
        properties: {
          root: {
            quoteLeftMark: '"»"',
            quoteRightMark: '"«"',
            quoteHangingMarkSpacing: '0.2em',
            quoteMarkOpacity: 1,
            quoteMarkFontWeight: 'normal',
            textBlockBlockQuoteHangingIndent: '2em'
          }
        }
      }
    },
    {
      name: 'With customized inline quotes',
      themeOptions: {
        quoteDesign: 'inline',
        properties: {
          root: {
            quoteLeftMark: '"»"',
            quoteRightMark: '"«"'
          }
        }
      }
    },
    {
      name: 'With custom lists',
      themeOptions: {
        properties: {
          root: {
            textBlockUnorderedListStyleType: '"-  "',
            textBlockUnorderedListMarkerColor: 'red',
            textBlockUnorderedListIndent: '15px',
            textBlockOrderedListIndent: '60px',
            textBlockFirstListItemMarginTop: '2rem',
            textBlockListItemMarginTop: 0
          }
        }
      }
    },
    {
      name: 'With custom content text colors',
      themeOptions: {
        properties: {
          root: {
            lightContentTextColor: 'green',
          },
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
          root: {
            darkContentTextColor: 'green',
          },
          headings: {
            darkContentTextColor: 'red'
          }
        }
      }
    }
  ]
});
