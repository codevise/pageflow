import React from 'react';

import {Entry, EntryStateProvider} from 'pageflow-scrolled/frontend';

import {normalizeAndMergeFixture, filePermaId} from 'pageflow-scrolled/spec/support/stories';
import {storiesOf} from '@storybook/react';

const lorem = 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr. Sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.';

const stories = storiesOf('Frontend/Section Transitions', module);

const transitions = ['fade', 'fadeBg', 'scroll', 'scrollOver', 'reveal', 'beforeAfter'];

transitions.forEach(transition1 =>
  transitions.forEach(transition2 =>
    stories.add(
      `${transition1}/${transition2}`,
      () =>
        <EntryStateProvider seed={exampleSeed(transition1, transition2)}>
          <Entry />
        </EntryStateProvider>,
      {
        percy: {skip: true}
      }
    )
  )
);

function exampleSeed(transition1, transition2) {
  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          transition: 'fade',
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
            image: filePermaId('imageFiles', 'churchBefore')
          },
          fullHeight: true
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
      {
        sectionId: 1,
        typeName: 'heading',
        configuration: {
          children: `Transition ${transition1}/${transition2}`
        }
      },
      {
        sectionId: 1,
        typeName: 'textBlock',
        configuration: {
          value: [
            {
              type: 'paragraph',
              children: [
                {text: lorem}
              ]
            }
          ]
        }
      },
      {
        sectionId: 2,
        typeName: 'heading',
        configuration: {
          children: `Transition ${transition1}`
        }
      },
      {
        sectionId: 2,
        typeName: 'textBlock',
        configuration: {
          value: [
            {
              type: 'paragraph',
              children: [
                {text: lorem}
              ]
            }
          ]
        }
      },
      {
        sectionId: 3,
        typeName: 'heading',
        configuration: {
          children: `Transition ${transition2}`
        }
      },
      {
        sectionId: 3,
        typeName: 'textBlock',
        configuration: {
          value: [
            {
              type: 'paragraph',
              children: [
                {text: lorem}
              ]
            }
          ]
        }
      }
    ]
  })
}
