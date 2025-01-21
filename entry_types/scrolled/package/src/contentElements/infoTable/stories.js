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
    }
  ]
});
