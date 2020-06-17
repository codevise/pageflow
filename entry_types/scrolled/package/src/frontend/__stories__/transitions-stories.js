import React from 'react';

import {Entry, RootProviders} from 'pageflow-scrolled/frontend';

import {
  normalizeAndMergeFixture,
  filePermaId,
  exampleHeading,
  exampleTextBlock
} from 'pageflow-scrolled/spec/support/stories';

import {storiesOf} from '@storybook/react';

const stories = storiesOf('Frontend/Section Transitions', module);

const transitions = ['fade', 'fadeBg', 'scroll', 'scrollOver', 'reveal', 'beforeAfter'];

transitions.forEach(transition1 =>
  transitions.forEach(transition2 =>
    stories.add(
      `${transition1}/${transition2}`,
      () =>
        <RootProviders seed={exampleSeed(transition1, transition2)}>
          <Entry />
        </RootProviders>,
      {
        percy: {skip: true}
      }
    )
  )
);

function exampleSeed(transition1, transition2) {
  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          transition: 'fade',
          backdrop: {
            image: filePermaId('imageFiles', 'turtle')
          },
          fullHeight: true
        }
      },
      {
        id: 2,
        configuration: {
          transition: transition1,
          backdrop: {
            image: filePermaId('imageFiles', 'churchBefore')
          },
          fullHeight: true
        }
      },
      {
        id: 3,
        configuration: {
          transition: transition2,
          backdrop: {
            image: filePermaId('imageFiles', 'churchAfter')
          },
          fullHeight: true
        }
      },
    ],
    contentElements: [
      exampleHeading({sectionId: 1, text: `Transition ${transition1}/${transition2}`}),
      exampleTextBlock({sectionId: 1}),
      exampleHeading({sectionId: 2, text: `Transition ${transition1}`}),
      exampleTextBlock({sectionId: 2}),
      exampleHeading({sectionId: 3, text: `Transition ${transition2}`}),
      exampleTextBlock({sectionId: 3}),
    ]
  })
}
