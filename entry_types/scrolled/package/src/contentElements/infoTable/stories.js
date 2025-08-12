import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'infoTable',
  baseConfiguration: {
    value: [
      {
        type: 'row',
        children: [
          {
            type: 'label',
            children: [
              {text: 'Name'}
            ]
          },
          {
            type: 'value',
            children: [
              {text: 'Jane '},
              {text: 'Doe', italic: true}
            ]
          }
        ]
      },
      {
        type: 'row',
        children: [
          {
            type: 'label',
            children: [
              {text: 'Website'}
            ]
          },
          {
            type: 'value',
            children: [
              {text: 'Find more '},
              {
                type: 'link',
                href: 'https://example.com',
                openInNewTab: true,
                children: [
                  {text: 'here'}
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  variants: [
    {
      name: 'With empty first columns',
      configuration: {
        value: [
          {
            type: 'row',
            children: [
              {
                type: 'label',
                children: [
                  {text: ''}
                ]
              },
              {
                type: 'value',
                children: [
                  {text: 'First column hidden'},
                ]
              }
            ]
          },
          {
            type: 'row',
            children: [
              {
                type: 'label',
                children: [
                  {text: ''}
                ]
              },
              {
                type: 'value',
                children: [
                  {text: 'No padding left in second column'}
                ]
              }
            ]
          }
        ]
      }
    },
    {
      name: 'Pallete colors',
      themeOptions: {
        properties: {
          root: {
            paletteColorAccent: '#04f',
            paletteColorPrimary: '#0f4'
          }
        }
      },
      configuration: {
        labelColor: 'accent',
        valueColor: 'primary'
      }
    },
    {
      name: 'With custom column alignment',
      configuration: {
        labelColumnAlign: 'right',
        valueColumnAlign: 'center'
      }
    },
    {
      name: 'Single column in phone layout',
      configuration: {
        singleColumnInPhoneLayout: true,
        value: [
          {
            type: 'row',
            children: [
              {
                type: 'label',
                children: [
                  {text: 'Very long label with lots of content'}
                ]
              },
              {
                type: 'value',
                children: [
                  {text: 'This is a very long value with lots of text that would be hard to read in narrow columns on mobile devices'}
                ]
              }
            ]
          },
          {
            type: 'row',
            children: [
              {
                type: 'label',
                children: [
                  {text: 'Long technical term'}
                ]
              },
              {
                type: 'value',
                children: [
                  {text: 'supercalifragilisticexpialidocious'}
                ]
              }
            ]
          }
        ]
      },
      viewport: 'phone'
    }
    ,
    {
      name: 'Single column in center ragged layout',
      configuration: {
        singleColumnInPhoneLayout: true
      },
      sectionConfiguration: {
        layout: 'centerRagged'
      },
      viewport: 'phone'
    },
    {
      name: 'With custom single column alignment',
      configuration: {
        singleColumnInPhoneLayout: true,
        singleColumnAlign: 'right'
      },
      viewport: 'phone'
    }
  ]
});
