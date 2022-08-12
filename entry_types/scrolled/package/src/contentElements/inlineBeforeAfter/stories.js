import '../frontend';
import {filePermaId, storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineBeforeAfter',
  baseConfiguration: {
    before_id: filePermaId('imageFiles', 'churchBefore'),
    after_id: filePermaId('imageFiles', 'churchAfter'),
    initial_slider_position: 50,
    before_label: '2010',
    after_label: '2020',
  },
  variants: [
    {
      name: 'full-width',
      configuration: {
        before_id: filePermaId('imageFiles', 'churchBefore'),
        after_id: filePermaId('imageFiles', 'churchAfter'),
        initial_slider_position: 50,
        before_label: '2010',
        after_label: '2020',
        position: 'full',
      }
    },
    {
      name: 'non-centered divider',
      configuration: {
        before_id: filePermaId('imageFiles', 'churchBefore'),
        after_id: filePermaId('imageFiles', 'churchAfter'),
        initial_slider_position: 30,
        before_label: 'Spring 2010',
        after_label: 'Spring 2020',
      }
    },
    {
      name: 'colored divider',
      configuration: {
        before_id: filePermaId('imageFiles', 'churchBefore'),
        after_id: filePermaId('imageFiles', 'churchAfter'),
        initial_slider_position: 50,
        slider_color: 'red',
        before_label: '2010',
        after_label: '2020',
      }
    },
    {
      name: 'With caption',
      configuration: {
        before_id: filePermaId('imageFiles', 'churchBefore'),
        after_id: filePermaId('imageFiles', 'churchAfter'),
        initial_slider_position: 50,
        caption: 'Some text here'
      }
    },
  ]
});
