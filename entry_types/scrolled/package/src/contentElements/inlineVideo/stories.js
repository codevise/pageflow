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
    },
    {
      name: 'with position backdrop',
      sectionConfiguration: {
        backdropType: 'contentElement',
        backdrop: {
          contentElement: 1001
        }
      },
      permaId: 1001,
      configuration: {
        position: 'backdrop'
      }
    }
  ],
  inlineFileRights: true
});
