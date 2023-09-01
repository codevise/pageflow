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
  {
    name: 'Short Text Left',
    items: [
      ['left', '4 / 3'],
      ['short text'],
    ]
  },
  {
    name: 'Short Text Right',
    items: [
      ['right', '4 / 3'],
      ['short text'],
    ]
  },
  {
    name: 'Multiple Left',
    items: [
      ['left', '4 / 3'],
      ['left', '4 / 3'],
      ['left', '4 / 3']
    ]
  },
  {
    name: 'Left Before Non-Wrapping',
    items: [
      ['left', '4 / 3'],
      ['inline', '4 / 3']
    ]
  },
  {
    name: 'Left Short/Right Long',
    items: [
      ['left', '4 / 3'],
      ['right', '3 / 4'],
      ['text']
    ]
  },
  {
    name: 'Left Long/Right Short',
    items: [
      ['left', '3 / 4'],
      ['right', '4 / 3'],
      ['text']
    ]
  },
  {
    name: 'Left/Right/Left',
    items: [
      ['left', '4 / 3'],
      ['right', '3 / 4'],
      ['left', '4 / 3'],
      ['text']
    ]
  },
  {
    name: 'Left/Right/Right/Left',
    items: [
      ['left', '4 / 3'],
      ['right', '3 / 4'],
      ['right', '4 / 3'],
      ['left', '4 / 8'],
      ['text']
    ]
  },
  {
    name: 'Right/Left/Right',
    items: [
      ['right', '4 / 3'],
      ['left', '3 / 4'],
      ['right', '4 / 3'],
      ['text']
    ]
  },
  {
    name: 'Left/Right/Left/Right',
    items: [
      ['left', '4 / 3'],
      ['right', '3 / 4'],
      ['left', '3 / 4'],
      ['right', '4 / 3'],
      ['text']
    ]
  },
  {
    name: 'Single Inlined Element',
    appearance: 'shadow',
    viewportWidth: 1000,
    items: [
      ['left', '4 / 3'],
      ['right', '4 / 3'],
      ['left', '4 / 3', contentElementWidths.lg],
    ]
  }
].forEach(({name, items, appearance, viewportWidth}) =>
  storiesOf(`Frontend/Floating and Self Clearing`, module)
    .add(
      name,
      () =>
        <RootProviders seed={exampleSeed({items, appearance})}>
          <Entry />
        </RootProviders>,
      viewportWidth ?
        {
          viewport: {
            viewports: {
              custom: {
                name: 'Custom',
                styles: {
                  width: `${viewportWidth}px`,
                  height: '1080px'
                }
              }
            },
            defaultViewport: 'custom'
          },
          percy: {widths: [viewportWidth]}
        } : {}
    )
);

function exampleSeed({items, appearance}) {
  const sectionBaseConfiguration = {
    transition: 'reveal',
    layout: 'center',
    appearance: appearance || 'cards',
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
      ...items.map(([typeName, aspectRatio, width], index) => {
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
            width,
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
