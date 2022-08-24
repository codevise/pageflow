import React from 'react';
import {storiesOf} from '@storybook/react';

import {Entry, RootProviders} from 'pageflow-scrolled/frontend';
import {MotifAreaVisibilityProvider} from '../MotifAreaVisibilityProvider';

import {
  normalizeAndMergeFixture,
  filePermaId,
  exampleHeading,
  exampleTextBlock
} from 'pageflow-scrolled/spec/support/stories';

const stories = storiesOf('Frontend/Motif Area/Min Height', module);

stories.add('Layout left', () =>
  <RootProviders seed={exampleSeed()}>
    <MotifAreaVisibilityProvider visible={true}>
      <Entry />
    </MotifAreaVisibilityProvider>
  </RootProviders>
)

function exampleSeed() {
  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          exposeMotifArea: true,
          fullHeight: false,
          backdrop: {
            image: filePermaId('imageFiles', 'turtle'),
            imageMotifArea: {left: 60, top: 10, height: 60, width: 30}
          }
        }
      },
      {
        configuration: {
          backdrop: {
            color: '#000'
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
