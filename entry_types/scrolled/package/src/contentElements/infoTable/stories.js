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
      name: 'With custom column alignment',
      configuration: {
        labelColumnAlign: 'right',
        valueColumnAlign: 'center'
      }
    }
  ]
});
