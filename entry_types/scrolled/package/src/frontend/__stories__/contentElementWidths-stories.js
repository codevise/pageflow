import React from 'react';
import Measure from 'react-measure';

import {Entry, RootProviders, ContentElementFigure, contentElementWidths, frontend} from 'pageflow-scrolled/frontend';

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

const viewports = {
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1920px',
      height: '1080px'
    }
  },
  desktopEditor: {
    name: 'Desktop Editor',
    styles: {
      width: '1599px',
      height: '1080px'
    }
  },
  ipadAir: {
    name: 'iPad Air',
    styles: {
      width: '1180px',
      height: '820px'
    }
  },
  ipadMini: {
    name: 'iPad Mini',
    styles: {
      width: '1024px',
      height: '786px'
    }
  },
  ipadAirPortrait: {
    name: 'iPad Air Portrait',
    styles: {
      width: '820px',
      height: '1180px'
    }
  },
  pixel5: {
    name: 'Pixel 5',
    styles: {
      width: '393px',
      height: '851px'
    }
  },
  iphone5: {
    name: 'iPhone 5',
    styles: {
      width: '320px',
      height: '568px'
    }
  },
};

['left', 'right', 'center'].forEach(layout => {
  ['desktop', 'desktopEditor', 'ipadAir', 'ipadMini', 'ipadAirPortrait', 'pixel5', 'iphone5'].forEach(defaultViewport => {
    storiesOf(`Frontend/Content Element Widths/${layout}`, module)
      .add(
        viewports[defaultViewport].name,
        () =>
          <RootProviders seed={exampleSeed({layout})}>
            <Entry />
          </RootProviders>,
        {
          viewport: {
            viewports,
            defaultViewport
          },
          percy: {
            widths: [parseInt(viewports[defaultViewport].styles.width, 10)]
          }
        }
      )
  });
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
    contentElements: exampleContentElements(1)
  });

  function exampleContentElements(sectionId) {
    if (layout === 'center') {
      return [
        exampleHeading({sectionId, text: 'Content element widths center', width: contentElementWidths.xl}),
        ...[3, 2, 1, 0, -1, -2, -3].flatMap(width => [
          examplePositionedElement({sectionId,
                                    typeName: 'measuringProbe',
                                    width,
                                    caption: `Width ${width}`})
        ]),
        ...[2, 1, 0, -1, -2].flatMap(width => [
          examplePositionedElement({sectionId,
                                    typeName: 'measuringProbe',
                                    position: 'left',
                                    width,
                                    caption: `Width ${width}`}),
          exampleTextBlock({sectionId}),
          exampleTextBlock({sectionId}),
        ]),
        ...[2, 1, 0, -1, -2].flatMap(width => [
          examplePositionedElement({sectionId,
                                    typeName: 'measuringProbe',
                                    position: 'left',
                                    width,
                                    caption: `Width ${width}`}),
          examplePositionedElement({sectionId,
                                    typeName: 'measuringProbe',
                                    position: 'right',
                                    width,
                                    caption: `Width ${width}`}),
          exampleTextBlock({sectionId}),
          exampleTextBlock({sectionId}),
        ])
      ];
    }
    else {
      return [
        exampleHeading({sectionId, text: `Content element widths ${layout}`, width: contentElementWidths.xl}),
        ...[3, 2, 1, 0, -1, -2, -3].flatMap(width => [
          examplePositionedElement({sectionId,
                                    typeName: 'measuringProbe',
                                    width,
                                    caption: `Width ${width}`})
        ]),
        ...[2, 1, 0, -1, -2].flatMap(width => [
          examplePositionedElement({sectionId,
                                    typeName: 'measuringProbe',
                                    position: 'sticky',
                                    width,
                                    caption: `Width ${width}`}),
          exampleTextBlock({sectionId}),
          exampleTextBlock({sectionId}),
        ])
      ];
    }
  }
}
