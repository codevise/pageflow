import React from 'react';

import {Entry, RootProviders} from 'pageflow-scrolled/frontend';

import {
  normalizeAndMergeFixture,
  exampleHeading,
  filePermaId
} from 'pageflow-scrolled/spec/support/stories';

import {storiesOf} from '@storybook/react';

storiesOf(`Frontend`, module)
  .add(
    'Backdrop Effects',
    () =>
      <RootProviders seed={exampleSeed({
        backdrop: {
          image: filePermaId('imageFiles', 'turtle')
        },
        effects: [
          {name: 'blur', value: 50},
          {name: 'sepia', value: 100}
        ]
      })}>
        <Entry />
      </RootProviders>
  )

function exampleSeed({backdrop, effects}) {
  const sectionBaseConfiguration = {
    transition: 'reveal',
    fullHeight: true
  };

  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          ...sectionBaseConfiguration,
          backdrop,
          backdropEffects: effects
        }
      }
    ],
    contentElements: exampleContentElements()
  });

  function exampleContentElements() {
    return [
      exampleHeading({sectionId: 1, text: 'Backdrop effect', position: 'wide'}),
    ];
  }
}
