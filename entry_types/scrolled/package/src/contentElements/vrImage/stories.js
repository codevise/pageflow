import '../frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

import MockDate from 'mockdate';
import inPercy from '@percy-io/in-percy';

if (inPercy()) {
  // Freeze time to prevent autocruise panorama movement from causing
  // visual diffs in Percy.
  MockDate.set('2021-08-02');
}

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
    {
      name: 'With position backdrop',
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
