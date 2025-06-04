import React from 'react';

import {Entry, RootProviders} from 'pageflow-scrolled/frontend';

import {
  normalizeAndMergeFixture,
  exampleHeading,
  exampleTextBlock,
  filePermaId
} from 'pageflow-scrolled/spec/support/stories';

import {storiesOf} from '@storybook/react';

storiesOf(`Frontend`, module)
  .add(
    'Backdrop Size',
    () =>
      <RootProviders seed={exampleSeed()}>
        <Entry />
      </RootProviders>
  )

function exampleSeed() {
  const sectionBaseConfiguration = {
    backdrop: {
      image: filePermaId('imageFiles', 'turtle')
    },
    backdropSize: 'coverSection',
    transition: 'reveal',
    fullHeight: false
  };

  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          ...sectionBaseConfiguration
        }
      }
    ],
    contentElements: exampleContentElements()
  });

  function exampleContentElements() {
    return [
      exampleHeading({sectionId: 1, text: 'Backdrop size cover section'}),
      exampleTextBlock({sectionId: 1})
    ];
  }
}
