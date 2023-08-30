import React from 'react';

import {
  Entry, RootProviders,
  contentElementWidths, contentElementWidthName,
  frontend
} from 'pageflow-scrolled/frontend';

import {
  normalizeAndMergeFixture,
  exampleHeading,
  exampleTextBlock,
  examplePositionedElement
} from 'pageflow-scrolled/spec/support/stories';

import {storiesOf} from '@storybook/react';

const appearanceOptions = ['shadow', 'transparent', 'cards'];

function positionOptions({layout, includeWidths}) {
  const result = [{position: 'inline'}];

  if (includeWidths) {
    result.push({position: 'inline', width: contentElementWidths.sm});
    result.push({position: 'inline', width: contentElementWidths.lg});
    result.push({position: 'inline', width: contentElementWidths.xl});
  }

  if (layout === 'left' || layout === 'right') {
    result.push({position: 'sticky'});
  }
  else {
    result.push({position: 'left'});
    result.push({position: 'right'});
  }

  result.push({position: 'inline', width: contentElementWidths.full});
  return result;
}

const customTextColorStyles = {
  '--theme-light-content-text-color': '#add1ff',
  '--theme-dark-content-text-color': '#3e5d85',
  '--root-light-content-text-color': 'var(--theme-light-content-text-color)',
  '--root-dark-content-text-color': 'var(--theme-dark-content-text-color)'
};

const customWidthStyles = {
  '--theme-section-max-width': '1110px',
  '--theme-two-column-inline-content-max-width': '540px',
  '--theme-two-column-sticky-content-width': '45%',
  '--theme-centered-inline-content-max-width': '940px',

  '--theme-narrow-section-max-width': '940px',
  '--theme-narrow-section-two-column-inline-content-max-width': '380px',
  '--theme-narrow-section-centered-inline-content-max-width': '540px'
}

frontend.contentElementTypes.register('customMarginExample', {
  component: function({customMargin}) {
    const outer = {
      background: 'blue',
      padding: '0 max(var(--content-margin), calc((100% - var(--content-max-width)) / 2)'
    };

    const inner = {
      background: 'green',
      maxWidth: 'var(--content-max-width)',
      padding: '200px 0',
      textAlign: 'center'
    };

    return (
      <div style={outer}>
        <div style={inner}>
          {customMargin ? 'Custom Margin' : 'Auto Margin'}
        </div>
      </div>
    );
  },
  lifecycle: true,
  customMargin: true
});

appearanceOptions.forEach(appearance => {
  storiesOf(`Frontend/Section Appearance/${appearance}`, module)
    .add(
      'Layout/Position',
      () =>
        <RootProviders seed={exampleSeed(appearance, {includeWidths: true})}>
          <Entry />
        </RootProviders>
    )
    .add(
      'Inverted',
      () =>
        <RootProviders seed={exampleSeed(appearance, {invert: true})}>
          <Entry />
        </RootProviders>
    )
    .add(
      'Custom text color',
      () =>
        <RootProviders seed={exampleSeed(appearance, {short: true})}>
          <div style={customTextColorStyles}>
            <Entry />
          </div>
        </RootProviders>
    )
    .add(
      'Custom text color - Inverted',
      () =>
        <RootProviders seed={exampleSeed(appearance, {short: true, invert: true})}>
          <div style={customTextColorStyles}>
            <Entry />
          </div>
        </RootProviders>
    )
    .add(
      'Custom Widths',
      () =>
        <RootProviders seed={exampleSeed(appearance)}>
          <div style={customWidthStyles}>
            <Entry />
          </div>
        </RootProviders>
    )
    .add(
      'Custom Widths - Narrow',
      () =>
        <RootProviders seed={exampleSeed(appearance, {width: 'narrow'})}>
          <div style={customWidthStyles}>
            <Entry />
          </div>
        </RootProviders>
    )
    .add(
      'Custom Margin',
      () =>
        <RootProviders seed={exampleSeed(appearance, {positionedElementTypeName: 'customMarginExample',
                                                      includeWidths: true})}>
          <Entry />
        </RootProviders>
    );
});


storiesOf(`Frontend/Section Appearance`, module)
  .add(
    'Custom Narrow Viewport Breakpoint',
    () => {
      const themeOptions = {
        properties: {
          root: {twoColumnStickyBreakpoint: '2000px'}
        }
      };

      return (
        <RootProviders seed={exampleSeed('shadow', {themeOptions})}>
          <Entry />
        </RootProviders>
      );
    }
  )

storiesOf(`Frontend/Section Appearance`, module)
  .add(
    'Custom Border Radiuses',
    () => {
      const customBorderRadiusStyles = {
        '--theme-cards-border-radius': '0',
        '--theme-content-element-box-border-radius': '10px'
      };

      return (
        <RootProviders seed={exampleSeed('cards')}>
          <div style={customBorderRadiusStyles}>
            <Entry />
          </div>
        </RootProviders>
      );
    }
  )

function exampleSeed(
  appearance, {short, invert, width, themeOptions, positionedElementTypeName, includeWidths} = {}
) {
  const sectionBaseConfiguration = {
    appearance,
    transition: 'reveal',
    fullHeight: true,
    invert,
    width
  };

  if (short) {
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
        }
      ],
      contentElements: exampleContentElements(1, 'left', positionedElementTypeName)
    });
  }

  return normalizeAndMergeFixture({
    themeOptions,
    sections: [
      {
        id: 1,
        configuration: {
          ...sectionBaseConfiguration,
          layout: 'left',
          backdrop: {
            color: '#cad2c5'
          },
        }
      },
      {
        id: 2,
        configuration: {
          ...sectionBaseConfiguration,
          layout: 'center',
          backdrop: {
            color: '#84a98c'
          },
        }
      },
      {
        id: 3,
        configuration: {
          ...sectionBaseConfiguration,
          layout: 'centerRagged',
          backdrop: {
            color: '#cad2c5'
          },
        }
      },
      {
        id: 4,
        configuration: {
          ...sectionBaseConfiguration,
          layout: 'right',
          backdrop: {
            color: '#52796f'
          },
        }
      },
      {
        id: 5,
        configuration: {
          ...sectionBaseConfiguration,
          fullHeight: false,
          backdrop: {
            color: '#000'
          },
        }
      }
    ],
    contentElements: [
      ...exampleContentElements(1, 'left', positionedElementTypeName),
      ...exampleContentElements(2, 'center', positionedElementTypeName),
      ...exampleContentElements(3, 'centerRagged', positionedElementTypeName),
      ...exampleContentElements(4, 'right', positionedElementTypeName),
      examplePositionedElement({sectionId: 5, position: 'full', positionedElementTypeName}),
    ]
  });

  function exampleContentElements(sectionId, layout, positionedElementTypeName) {
    return [
      exampleHeading({sectionId, text: 'A Heading wider than the Section', width: contentElementWidths.xl}),
      exampleHeading({sectionId, text: `${appearance} / ${layout}`}),

      ...positionOptions({layout, includeWidths}).map(({position, width}) => [
        examplePositionedElement({sectionId,
                                  typeName: positionedElementTypeName,
                                  position,
                                  width,
                                  caption: `Position ${position}/Width ${contentElementWidthName(width)}`}),
        exampleTextBlock({sectionId}),
        exampleTextBlock({sectionId}),
      ]).flat()
    ];s
  }
}
