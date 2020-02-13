import './frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineImage',
  baseConfiguration: {
    id: filePermaId('imageFiles', 'turtle')
  },
  variants: [
    {
      name: 'With Caption',
      configuration: {caption: 'Some text here'}
    }
  ]
});
