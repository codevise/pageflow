import './frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'logoList',
  baseConfiguration: {
    items: [
      {id: 1, image: filePermaId('imageFiles', 'turtle')},
      {id: 2, image: filePermaId('imageFiles', 'churchBefore')},
      {id: 3, image: filePermaId('imageFiles', 'churchAfter')},
      {id: 4, image: filePermaId('imageFiles', 'turtle')},
      {id: 5, image: filePermaId('imageFiles', 'churchBefore')},
      {id: 6, image: filePermaId('imageFiles', 'churchAfter')}
    ]
  }
});
