import '../frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineVideo',
  baseConfiguration: {
    id: filePermaId('videoFiles', 'interview_toni'),
    autoplay: false,
    controls: false
  },
  variants: [
    {
      name: 'with poster image',
      configuration: {
        posterId: filePermaId('imageFiles', 'turtle')
      }
    }
  ]
});
