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
    },
    {
      name: 'with white circle play button',
      themeOptions: {
        properties: {
          root: {
            bigPlayPauseButtonBackground: 'radial-gradient(#fff, #fff 60%, rgba(255, 255, 255, 0) 61%)',
            bigPlayPauseButtonIconFill: '#000',
            bigPlayPauseButtonSize: '80px',
            bigPlayPauseButtonIconSize: '64px'
          }
        }
      }
    }
  ],
  inlineFileRights: true
});
