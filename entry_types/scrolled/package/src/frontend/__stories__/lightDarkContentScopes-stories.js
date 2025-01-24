import React from 'react';

import {
  normalizeAndMergeFixture,
  exampleHeading,
  exampleTextBlock,
  ExampleEntry
} from 'pageflow-scrolled/spec/support/stories';

import {storiesOf} from '@storybook/react';
storiesOf(`Frontend`, module)
  .add(
    'Light and Dark Content Scopes',
    () => {
      const themeOptions = {
        properties: {
          darkContent: {
            accentColor: 'green'
          },

          lightContent: {
            accentColor: 'yellow'
          }
        },
        typography: {
          heading: {
            color: 'var(--theme-accent-color)'
          }
        }
      };

      return (
        <ExampleEntry seed={exampleSeed(themeOptions)} />
      );
    }
  )

function exampleSeed(themeOptions) {
  const sectionBaseConfiguration = {
    transition: 'reveal'
  };

  return normalizeAndMergeFixture({
    themeOptions,
    sections: [
      {
        id: 1,
        configuration: {
          ...sectionBaseConfiguration,
          backdrop: {
            color: '#cad2c5'
          }
        }
      },
      {
        id: 2,
        configuration: {
          ...sectionBaseConfiguration,
          invert: true,
          backdrop: {
            color: '#cad2c5'
          }
        }
      },
      {
        id: 3,
        configuration: {
          ...sectionBaseConfiguration,
          appearance: 'cards',
          backdrop: {
            color: '#cad2c5'
          }
        }
      },
      {
        id: 4,
        configuration: {
          ...sectionBaseConfiguration,
          appearance: 'cards',
          invert: true,
          backdrop: {
            color: '#cad2c5'
          }
        }
      }
    ],
    contentElements: [
      ...exampleContentElements(1),
      ...exampleContentElements(2),
      ...exampleContentElements(3),
      ...exampleContentElements(4)
    ]
  });

  function exampleContentElements(sectionId) {
    return [
      exampleHeading({sectionId, text: 'A Heading'}),
      exampleTextBlock({sectionId}),
    ];
  }
}
