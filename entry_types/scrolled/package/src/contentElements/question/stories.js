import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';
import {editableTextValue} from 'pageflow-scrolled/spec/support/editableTextValues';

storiesOfContentElement(module, {
  typeName: 'question',
  baseConfiguration: {
    expandByDefault: true,
    question: editableTextValue('What else is important?', {type: 'heading'}),
    answer: editableTextValue([
      'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ',
      'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
    ])
  },
  variants: [
    {
      name: 'Closed',
      configuration: {
        expandByDefault: false
      }
    },
    {
      name: 'Palette Colors',
      themeOptions: {
        properties: {
          root: {
            paletteColorAccent: '#04f',
            paletteColorPrimary: '#0d3',
          }
        }
      },
      configuration: {
        color: 'accent',
        answerColor: 'primary'
      }
    }
  ]
});
