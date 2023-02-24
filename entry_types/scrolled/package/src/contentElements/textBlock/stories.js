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
          {text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. '},
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
      name: 'With theme link color',
      configuration: linkExampleConfiguration,
      themeOptions: {
        properties: {
          contentLinkColor: 'red'
        }
      }
    },
    {
      name: 'With theme light link color',
      configuration: linkExampleConfiguration,
      themeOptions: {
        properties: {
          lightContentLinkColor: 'yellow',
          darkContentLinkColor: 'green',
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
          lightContentLinkColor: 'yellow',
          darkContentLinkColor: 'green',
        }
      }
    },
    {
      name: 'With customiezed hanging quotes',
      themeOptions: {
        quoteDesign: 'hanging',
        properties: {
          quoteLeftMark: '"»"',
          quoteRightMark: '"«"',
          quoteMarkOpacity: 1,
          quoteMarkFontWeight: 'normal'
        }
      }
    },
    {
      name: 'With customiezed inline quotes',
      themeOptions: {
        quoteDesign: 'inline',
        properties: {
          quoteLeftMark: '"»"',
          quoteRightMark: '"«"'
        }
      }
    }
  ]
});
