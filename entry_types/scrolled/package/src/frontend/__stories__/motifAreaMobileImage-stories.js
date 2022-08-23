import React from 'react';
import {storiesOf} from '@storybook/react';
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport';

import {Entry, RootProviders} from 'pageflow-scrolled/frontend';
import {MotifAreaVisibilityProvider} from '../MotifAreaVisibilityProvider';

import {
  normalizeAndMergeFixture,
  filePermaId,
  exampleHeading,
  exampleTextBlock
} from 'pageflow-scrolled/spec/support/stories';

const stories = storiesOf('Frontend/Motif Area/Mobile Image', module);

stories.add('Layout left', () =>
  <RootProviders seed={exampleSeed()}>
    <MotifAreaVisibilityProvider visible={true}>
      <Entry />
    </MotifAreaVisibilityProvider>
  </RootProviders>, {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone6'
    },
    percy: {
      widths: [320, 1280]
    }
  }
)

function exampleSeed() {
  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          exposeMotifArea: true,
          fullHeight: true,
          backdrop: {
            image: filePermaId('imageFiles', 'turtle'),
            imageMotifArea: {left: 20, top: 10, height: 60, width: 30},
            imageMobile: filePermaId('imageFiles', 'churchBefore'),
            imageMobileMotifArea: {left: 60, top: 10, height: 60, width: 30}
          }
        }
      }
    ],
    contentElements: [
      exampleHeading({sectionId: 1, text: 'Titel'}),
      exampleTextBlock({sectionId: 1})
    ]
  })
}
