import React from 'react';

import {Entry, RootProviders} from 'pageflow-scrolled/frontend';

import {
  normalizeAndMergeFixture,
  exampleHeading,
  exampleTextBlock,
  examplePositionedElement
} from 'pageflow-scrolled/spec/support/stories';

import {storiesOf} from '@storybook/react';

const appearanceOptions = ['shadow', 'transparent', 'cards'];
const positionOptions = {
  left: ['inline', 'sticky', 'full'],
  right: ['inline', 'sticky', 'full'],
  center: ['inline', 'left', 'right', 'full'],
  centerRagged: ['inline', 'left', 'right', 'full'],
}

const customTextColorStyles = {
  '--theme-light-content-text-color': '#add1ff',
  '--theme-dark-content-text-color': '#3e5d85'
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

appearanceOptions.forEach(appearance => {
  storiesOf(`Frontend/Section Appearance/${appearance}`, module)
    .add(
      'Layout/Position',
      () =>
        <RootProviders seed={exampleSeed(appearance)}>
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
    );
});


storiesOf(`Frontend/Section Appearance`, module)
  .add(
    'Custom Narrow Viewport Breakpoint',
    () => {
      const themeOptions = {
        properties: {
          root: {narrowViewportBreakpoint: '2000px'}
        }
      };

      return (
        <RootProviders seed={exampleSeed('shadow', {themeOptions})}>
          <Entry />
        </RootProviders>
      );
    }
  )

function exampleSeed(appearance, {short, invert, width, themeOptions} = {}) {
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
      contentElements: exampleContentElements(1, 'left')
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
      ...exampleContentElements(1, 'left'),
      ...exampleContentElements(2, 'center'),
      ...exampleContentElements(3, 'centerRagged'),
      ...exampleContentElements(4, 'right'),
      examplePositionedElement({sectionId: 5, position: 'full'}),
    ]
  });

  function exampleContentElements(sectionId, layout) {
    return [
      exampleHeading({sectionId, text: 'A Heading wider than the Section', position: 'wide'}),
      exampleHeading({sectionId, text: `${appearance} / ${layout}`}),

      ...positionOptions[layout].map(position => [
        examplePositionedElement({sectionId, position, caption: `Position ${position}`}),
        exampleTextBlock({sectionId}),
        exampleTextBlock({sectionId}),
      ]).flat()
    ];
  }
}
