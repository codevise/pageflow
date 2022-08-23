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

const stories = storiesOf('Frontend/Motif Area/Padding', module);

const motifAreaOnTheLeft = {left: 10, top: 20, height: 50, width: 30};
const motifAreaOnTheRight = {left: 60, top: 20, height: 30, width: 30};

const scenarios = {
  left: [
    {
      name: 'two column',
      motifArea: motifAreaOnTheRight
    },
    {
      name: 'intersecting',
      motifArea: motifAreaOnTheLeft
    },
  ],
  right: [
    {
      name: 'two column',
      motifArea: motifAreaOnTheLeft
    },
    {
      name: 'intersecting',
      motifArea: motifAreaOnTheRight
    },
  ],
  center: [
    {
      name: 'intersecting',
      motifArea: motifAreaOnTheLeft
    },
  ]
};

Object.keys(scenarios).forEach(layout =>
  scenarios[layout].forEach(scenario =>
    stories.add(`Layout ${layout} ${scenario.name}`, () =>
      <RootProviders seed={exampleSeed({layout,
                                        fullHeight: true,
                                        motifArea: scenario.motifArea})}>
        <MotifAreaVisibilityProvider visible={true}>
          <Entry />
        </MotifAreaVisibilityProvider>
      </RootProviders>
    )
  )
);

function exampleSeed({layout, fullHeight, motifArea}) {
  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          layout,
          exposeMotifArea: true,
          fullHeight,
          backdrop: {
            image: filePermaId('imageFiles', 'turtle'),
            imageMotifArea: motifArea
          }
        }
      },
      ...(fullHeight ? [] : [
        {
          configuration: {
            backdrop: {
              color: '#000'
            }
          }
        }
      ])
    ],
    contentElements: [
      exampleHeading({sectionId: 1, text: 'Titel'}),
      ...(Array(fullHeight ? 3 : 1).fill().map(() => exampleTextBlock({sectionId: 1})))
    ]
  })
}
