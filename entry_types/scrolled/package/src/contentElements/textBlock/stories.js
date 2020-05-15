import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

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
          {text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. '}
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
  }
});
