import React from 'react';
import Measure from 'react-measure';

import {Entry, RootProviders, ContentElementFigure, frontend} from 'pageflow-scrolled/frontend';

import {
  normalizeAndMergeFixture,
  exampleHeading,
  exampleTextBlock,
  examplePositionedElement
} from 'pageflow-scrolled/spec/support/stories';

import {storiesOf} from '@storybook/react';

frontend.contentElementTypes.register('measuringProbe', {
  component: function({configuration}) {
    const outer = {
      background: 'green',
      aspectRatio: '4 / 3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    return (
      <Measure bounds>
        {({measureRef, contentRect}) =>
          <ContentElementFigure configuration={configuration}>
            <div ref={measureRef} style={outer}>
              {contentRect.bounds.width}px
            </div>
          </ContentElementFigure>
        }
      </Measure>
    );
  }
});

['left', 'center'].forEach(layout => {
  storiesOf(`Frontend/Content Element Alignment`, module)
    .add(`Layout ${layout}`, () =>
      <RootProviders seed={exampleSeed({layout})}>
        <Entry />
      </RootProviders>
    );
});

function exampleSeed({layout}) {
  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          layout,
          transition: 'reveal',
          fullHeight: true,
          backdrop: {
            color: '#cad2c5'
          }
        }
      }
    ],
    contentElements: exampleContentElements(1, layout)
  });

  function exampleContentElements(sectionId, layout) {
    const elements = [
      exampleHeading({sectionId, text: 'Content element alignment'}),
      examplePositionedElement({sectionId,
                                typeName: 'measuringProbe',
                                width: -1,
                                configuration: {alignment: 'left'},
                                caption: 'Left'}),
      examplePositionedElement({sectionId,
                                typeName: 'measuringProbe',
                                width: -1,
                                caption: 'Center'}),
      examplePositionedElement({sectionId,
                                typeName: 'measuringProbe',
                                width: -1,
                                configuration: {alignment: 'right'},
                                caption: 'Right'})
    ];

    if (layout === 'left') {
      elements.push(
        examplePositionedElement({sectionId,
                                  typeName: 'measuringProbe',
                                  position: 'sticky',
                                  width: -1,
                                  configuration: {alignment: 'left'},
                                  caption: 'Sticky (alignment ignored)'}),
        exampleTextBlock({sectionId})
      );
    }
    else {
      elements.push(
        exampleTextBlock({sectionId}),
        examplePositionedElement({sectionId,
                                  typeName: 'measuringProbe',
                                  position: 'left',
                                  width: -1,
                                  configuration: {alignment: 'right'},
                                  caption: 'Floated (alignment ignored)'})
      );
    }

    elements.push(
      exampleTextBlock({sectionId})
    );

    return elements;
  }
}
