import React from 'react';

import {Entry, RootProviders, contentElementWidths, frontend} from 'pageflow-scrolled/frontend';

import {
  normalizeAndMergeFixture,
  exampleHeading,
  exampleTextBlock,
  examplePositionedElement
} from 'pageflow-scrolled/spec/support/stories';

import {storiesOf} from '@storybook/react';

frontend.contentElementTypes.register('probe', {
  component: function({configuration}) {
    const outer = {
      background: 'blue',
      color: 'white',
      aspectRatio: configuration.aspectRatio,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    return (
      <div style={outer}>
        {configuration.index}: {configuration.aspectRatio}
      </div>
    );
  }
});

[
  [
    'Short Text Left',
    ['left', '4 / 3'],
    ['short text'],
  ],
  [
    'Short Text Right',
    ['right', '4 / 3'],
    ['short text'],
  ],
  [
    'Multiple Left',
    ['left', '4 / 3'],
    ['left', '4 / 3'],
    ['left', '4 / 3']
  ],
  ,
  [
    'Left Before Non-Wrapping',
    ['left', '4 / 3'],
    ['inline', '4 / 3']
  ],
  [
    'Left Short/Right Long',
    ['left', '4 / 3'],
    ['right', '3 / 4'],
    ['text']
  ],
  [
    'Left Long/Right Short',
    ['left', '3 / 4'],
    ['right', '4 / 3'],
    ['text']
  ],
  [
    'Left/Right/Left',
    ['left', '4 / 3'],
    ['right', '3 / 4'],
    ['left', '4 / 3'],
    ['text']
  ],
  [
    'Left/Right/Right/Left',
    ['left', '4 / 3'],
    ['right', '3 / 4'],
    ['right', '4 / 3'],
    ['left', '4 / 8'],
    ['text']
  ],
  [
    'Right/Left/Right',
    ['right', '4 / 3'],
    ['left', '3 / 4'],
    ['right', '4 / 3'],
    ['text']
  ],
  [
    'Left/Right/Left/Right',
    ['left', '4 / 3'],
    ['right', '3 / 4'],
    ['left', '3 / 4'],
    ['right', '4 / 3'],
    ['text']
  ]
].forEach(([name, ...items]) =>
  storiesOf(`Frontend/Floating and Self Clearing`, module)
    .add(
      name,
      () =>
        <RootProviders seed={exampleSeed(items)}>
          <Entry />
        </RootProviders>
    )
);

function exampleSeed(items) {
  const sectionBaseConfiguration = {
    transition: 'reveal',
    appearance: 'cards',
    layout: 'center',
    fullHeight: true
  };

  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          ...sectionBaseConfiguration,
          backdrop: {
            color: '#cad2c5'
          }
        }
      }
    ],
    contentElements: [
      exampleHeading({sectionId: 1, text: 'Self Clearing Boxes', width: contentElementWidths.xl}),
      ...items.map(([typeName, aspectRatio], index) => {
        if (typeName === 'short text') {
          return exampleTextBlock({sectionId: 1, text: 'Short Text'});
        }
        else if (typeName === 'text') {
          return exampleTextBlock({sectionId: 1});
        }
        else {
          return examplePositionedElement({
            sectionId: 1,
            typeName: 'probe',
            position: typeName,
            configuration: {
              aspectRatio,
              index
            }
          });
        }
      }),
    ]
  });
}
