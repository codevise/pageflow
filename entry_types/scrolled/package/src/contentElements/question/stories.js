import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'question',
  baseConfiguration: {
    expandByDefault: true,
    question: [
      {
        type: 'heading',
        children: [
          {text: 'What else is important?'}
        ]
      }
    ],
    answer: [
      {
        type: 'paragraph',
        children: [
          {text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. '}
        ]
      },
      {
        type: 'paragraph',
        children: [
          {text: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'}
        ]
      }
    ]
  },
  variants: [
    {
      name: 'Closed',
      configuration: {
        expandByDefault: false
      }
    }
  ]
});
