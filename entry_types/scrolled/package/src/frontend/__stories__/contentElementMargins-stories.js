import React from 'react';

import {ContentElementFigure, contentElementWidths, frontend} from 'pageflow-scrolled/frontend';

import {
  ExampleEntry,
  normalizeAndMergeFixture,
  exampleHeading,
  examplePositionedElement
} from 'pageflow-scrolled/spec/support/stories';

import {storiesOf} from '@storybook/react';

frontend.contentElementTypes.register('marginProbe', {
  component: function({configuration}) {
    const inner = {
      background: 'green',
      aspectRatio: '4 / 3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    return (
      <ContentElementFigure configuration={configuration}>
        <div style={inner} />
      </ContentElementFigure>
    );
  }
});

storiesOf(`Frontend`, module)
  .add(
    'Content Element Margins',
    () =><ExampleEntry seed={exampleSeed()} />
  );

function exampleSeed() {
  return normalizeAndMergeFixture({
    themeOptions: {
      properties: {
        root: {
          contentElementMarginLg: '3rem',
          contentElementMarginXl: '10rem',
        }
      }
    },
    sections: [
      {
        id: 1,
        configuration: {
          transition: 'reveal',
          fullHeight: true,
          backdrop: {
            color: '#cad2c5'
          }
        }
      }
    ],
    contentElements: exampleContentElements(1)
  });

  function exampleContentElements(sectionId) {
    return [
      exampleHeading({sectionId, text: 'Content element margins', width: contentElementWidths.xl}),
      examplePositionedElement({
        sectionId,
        typeName: 'marginProbe',
        configuration: {
          caption: 'Margin bottom',
          marginBottom: 'lg'
        }
      }),
      examplePositionedElement({
        sectionId,
        typeName: 'marginProbe',
        configuration: {
          caption: 'Default margin'
        }
      }),
      examplePositionedElement({
        sectionId,
        typeName: 'marginProbe',
        configuration: {
          caption: 'Default margin'
        }
      }),
      examplePositionedElement({
        sectionId,
        typeName: 'marginProbe',
        configuration: {
          caption: 'Margin top',
          marginTop: 'xl'
        }
      })
    ];
  }
}
