import React from 'react';
import {Entry, RootProviders, setupI18n} from 'pageflow-scrolled/frontend';
import {browser} from 'pageflow/frontend';

import {normalizeSeed} from './normalizeSeed';
import {storiesOf} from '@storybook/react';

import seedFixtureFromFile from '../../.storybook/seed.json'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
browser.detectFeatures();
let seedFixture = seedFixtureFromFile;

/**
 * Add default set of stories for content element to render it in
 * different settings (e.g. different section layouts).
 *
 * @param {Object} module - the module global available in every file
 * @param {Object} options
 * @param {string} typeName - Name the content element is registered as.
 * @param {Object} baseConfiguration -
 *   Configuration to use for all added stories. A heading element,
 *   for example, would require a text.
 * @param {Array<Object>} variants -
 *   An array of objects each containing a `name` and a
 *   `configuration` property. The configurations will be merged into
 *   the `baseConfiguration` to create further examples that shall be
 *   rendered as stories.
 *
 * @example
 *
 * // heading/stories.js
 *
 * import './frontend';
 * import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';
 *
 * storiesOfContentElement(module, {
 *   typeName: 'heading',
 *   baseConfiguration: {
 *     text: 'Some Heading'
 *   },
 *   variants: [
 *     {
 *       name: 'Large',
 *       configuration: {size: 'large'}
 *     }
 *   ]
 * });
 */
export function storiesOfContentElement(module, options) {
  const stories = storiesOf(`Content Elements/${options.typeName}`, module);

  if (seedFixture.i18n) {
    setupI18n(seedFixture.i18n);
  }

  exampleStories(options).forEach(({title, seed, parameters = {}}) => {
    stories.add(title,
                () =>
                  <RootProviders seed={seed}>
                    <Entry />
                  </RootProviders>,
                {
                  ...parameters,
                  viewport: {
                    viewports: INITIAL_VIEWPORTS,
                    ...parameters.viewport
                  }
                })
  });
}

/**
 * When generating a `.storybook/seed.json` via the
 * `pageflow_scrolled:storybook:seed:setup` Rake task, a couple of
 * examples files are created. This method allows getting the perma id
 * of one of those files from one of the following reference names:
 *
 * * "turtle" (image)
 * * "interview_toni" (video)
 * * "quicktime_jingle" (audio)
 *
 * @param {string} collectionName - A name of a files collection like `"imageFiles"`.
 * @param {string} testReferenceName - Name of a predefined file from the seed JSON file.
 *
 * @example
 *
 * // inlineImage/stories.js
 *
 * import './frontend';
 * import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';
 *
 * storiesOfContentElement(module, {
 *   typeName: 'inlineImage',
 *   baseConfiguration: {id: filePermaId('imageFiles', 'turtle')}
 * });
*/
export function filePermaId(collectionName, testReferenceName) {
  const fileCollection = seedFixture.collections[collectionName];

  if (!fileCollection) {
    throw new Error(`Unknown file collection "${collectionName}`);
  }

  const file = fileCollection.find(file =>
    file.configuration.testReferenceName === testReferenceName
  );

  if (!file) {
    throw new Error(`No file with testReferenceName "${testReferenceName}" in collection "${collectionName}`);
  }

  return file.permaId;
}

export function exampleStories(options) {
  return [
    ...variantsExampleStories(options),
    ...layoutExampleStories(options),
    ...mobileExampleStories(options)
  ];
}

function variantsExampleStories({typeName, baseConfiguration, variants}) {
  if (!variants) {
    return [];
  }

  return exampleStoryGroup({
    typeName,
    name: 'Variants',
    examples: variants.map(({name, configuration}) => ({
      name: name,
      contentElementConfiguration: {...baseConfiguration, ...configuration}
    }))
  });
}

function layoutExampleStories({typeName, baseConfiguration}) {
  return exampleStoryGroup({
    typeName,
    name: 'Layout',
    examples: [
      {
        name: 'Left',
        sectionConfiguration: {layout: 'left'},
        contentElementConfiguration: baseConfiguration
      },
      {
        name: 'Center',
        sectionConfiguration: {layout: 'center'},
        contentElementConfiguration: baseConfiguration
      },
      {
        name: 'Right',
        sectionConfiguration: {layout: 'right'},
        contentElementConfiguration: baseConfiguration
      }
    ]
  });
}

function mobileExampleStories({typeName, baseConfiguration}) {
  return exampleStoryGroup({
    typeName,
    name: 'Phone',
    examples: [
      {
        name: 'Default',
        contentElementConfiguration: baseConfiguration,
      }
    ],
    parameters: {
      viewport: {
        defaultViewport: 'iphone6'
      },
      percy: {
        widths: [320]
      }
    }
  });
}

function exampleStoryGroup({name, typeName, examples, parameters}) {
  const defaultSectionConfiguration = {transition: 'scroll', backdrop: {image: '#000'}, fullHeight: false};

  const sections = examples.map((example, index) => ({
    id: index,
    configuration: {transition: 'scroll', backdrop: {image: '#000'}, fullHeight: false, ...defaultSectionConfiguration, ...example.sectionConfiguration}
  }));

  const contentElements = examples.reduce((memo, example, index) => [
    ...memo,
    exampleHeading({sectionId: index, text: `${name} - ${example.name}`}),
    {sectionId: index, typeName, configuration: example.contentElementConfiguration}
  ], []);

  if (process.env.STORYBOOK_SPLIT) {
    return sections.map((section, index) => ({
      title: `${name} - ${examples[index].name}`,
      seed: normalizeAndMergeFixture({
        sections: [section],
        contentElements: contentElements
      }),
      parameters
    }));
  }
  else {
    return [
      {
        title: name,
        seed: normalizeAndMergeFixture({
          sections: sections,
          contentElements: contentElements
        }),
        parameters
      }
    ];
  }
}

export function normalizeAndMergeFixture(options) {
  const seed = normalizeSeed(options);

  return {
    ...seedFixture,
    collections: {
      ...seedFixture.collections,
      chapters: seed.collections.chapters,
      sections: seed.collections.sections,
      contentElements: seed.collections.contentElements
    }
  };
}

export function exampleHeading({sectionId, text}) {
  return {
    sectionId,
    typeName: 'heading',
    configuration: {
      children: text,
      level: 1
    }
  }
}

const lorem = 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr. Sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.';

export function exampleTextBlock({sectionId}) {
  return {
    sectionId,
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
  };
}

export function examplePositionedElement({sectionId, position, caption}) {
  return {
    sectionId,
    typeName: 'inlineImage',
    configuration: {
      position,
      id: null,
      caption
    }
  }
}

// This method is only used in specs of this file. I could not find
// anouth way to stub the missing seed.json file.
export function stubSeedFixture(seed) {
  seedFixture = seed;
}
