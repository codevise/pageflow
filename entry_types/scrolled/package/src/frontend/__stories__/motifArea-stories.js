import React from 'react';
import {storiesOf} from '@storybook/react';

import {Entry, RootProviders} from 'pageflow-scrolled/frontend';
import {MotifAreaVisibilityProvider} from '../MotifArea';

import {
  normalizeAndMergeFixture,
  filePermaId,
  exampleHeading,
  exampleTextBlock
} from 'pageflow-scrolled/spec/support/stories';


let transitions = ['fade', 'fadeBg', 'scroll', 'scrollOver', 'reveal', 'beforeAfter'];

const enterTransitions = {
  fade: 'fadeIn',
  fadeBg: 'fadeInBg',
  scroll: 'scrollIn',
  scrollOver: 'scrollIn',
  reveal: 'reveal',
  beforeAfter: 'reveal'
};

const exitTransitions = {
  fade: 'fadeOut',
  fadeBg: 'fadeOutBg',
  scroll: 'ScrollOut',
  scrollOver: 'Conceal',
  reveal: 'ScrollOut',
  beforeAfter: 'Conceal'
};

const motifAreas = {
  'top-left': {
    left: 5,
    top: 5,
    width: 50,
    height: 25
  },
  'bottom-left': {
    left: 5,
    top: 70,
    width: 50,
    height: 25
  },
  'top-right': {
    left: 60,
    top: 5,
    width: 25,
    height: 25
  },
  'bottom-right': {
    left: 60,
    top: 70,
    width: 25,
    height: 25
  }
};

[true, false].forEach(fullHeight =>
  [true, false].forEach(withContent => {
    const prefix = [
      'Frontend/Motif Area',
      fullHeight ? 'Full Height' : 'Dynamic Height',
      withContent ? 'With Content' : 'No Content'
    ].join('/');

    const stories = {}

    transitions.forEach(transition1 =>
      transitions.forEach(transition2 => {
        if (fullHeight || (!transition1.startsWith('fade') && !transition2.startsWith('fade'))) {
          ['top-left', 'bottom-left', 'top-right', 'bottom-right'].forEach(motifAreaPosition => {
            const key = `${enterTransitions[transition1]}${exitTransitions[transition2]}`;

            stories[key] = stories[key] || storiesOf(
              `${prefix}/${enterTransitions[transition1]} - ${exitTransitions[transition2]}`,
              module
            )

            const seed = exampleSeed({
              transition1,
              transition2,
              fullHeight,
              textBlocks: withContent ? 1 : 0,
              motifArea: motifAreas[motifAreaPosition],
              title: `${transition1}/${transition2}/${motifAreaPosition}`
            });

            stories[key].add(
              `${transition1}/${transition2}/${motifAreaPosition}`,
              () =>
                <RootProviders seed={seed}>
                  <MotifAreaVisibilityProvider visible={true}>
                    <Entry />
                  </MotifAreaVisibilityProvider>
                </RootProviders>,
              {
                percy: {skip: true}
              }
            );
          });
        }
      })
    );
  })
);

function exampleSeed({transition1, transition2, motifArea, fullHeight, title, textBlocks}) {
  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          transition: 'scroll',
          backdrop: {
            image: filePermaId('imageFiles', 'turtle')
          },
          fullHeight: true
        }
      },
      {
        id: 2,
        configuration: {
          transition: transition1,
          backdrop: {
            image: filePermaId('imageFiles', 'churchBefore'),
            imageMotifArea: motifArea
          },
          fullHeight
        }
      },
      {
        id: 3,
        configuration: {
          transition: transition2,
          backdrop: {
            image: filePermaId('imageFiles', 'churchAfter')
          },
          fullHeight: true
        }
      },
    ],
    contentElements: [
      exampleHeading({sectionId: 1, text: title}),
      exampleTextBlock({
        sectionId: 1,
        text: 'See docs/internal/understanding_motif_area_handling.md for details'
      }),
      ...(Array(textBlocks).fill().map(() => exampleTextBlock({sectionId: 2}))),
      exampleTextBlock({sectionId: 3}),
    ]
  })
}
