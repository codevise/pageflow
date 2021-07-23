import '../frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'vrImage',
  baseConfiguration: {
    image: filePermaId('imageFiles', 'equirectangularMono')
  },
  variants: [
    {
      name: 'With initial yaw and pitch',
      configuration: {
        initialYaw: 180,
        initialPitch: 30
      }
    },
    {
      name: 'Stereo image',
      configuration: {
        image: filePermaId('imageFiles', 'equirectangularStereo')
      }
    },
    {
      name: 'With caption',
      configuration: {
        caption: 'Some text here'
      }
    },
  ]
});
