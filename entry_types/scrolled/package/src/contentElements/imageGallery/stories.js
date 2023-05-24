import './frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'imageGallery',
  baseConfiguration: {
    items: [
      {
        id: 1,
        image: filePermaId('imageFiles', 'turtle'),
        caption: [
          {
            type: 'paragraph',
            children: [
              {text: 'At vero eos et accusam et justo duo dolores et ea rebum.'}
            ]
          }
        ]
      },
      {
        id: 2,
        image: filePermaId('imageFiles', 'churchBefore'),
        caption: [
          {
            type: 'paragraph',
            children: [
              {text: 'At vero eos et accusam et justo duo dolores et ea rebum.'}
            ]
          }
        ]
      },
      {
        id: 3,
        image: filePermaId('imageFiles', 'churchAfter'),
        caption: [
          {
            type: 'paragraph',
            children: [
              {text: 'At vero eos et accusam et justo duo dolores et ea rebum.'}
            ]
          }
        ]
      },
      {
        id: 4,
        image: filePermaId('imageFiles', 'turtle')
      },
      {
        id: 5,
        image: filePermaId('imageFiles', 'churchBefore')
      },
      {
        id: 6,
        image: filePermaId('imageFiles', 'churchAfter')
      }
    ]
  }
});
