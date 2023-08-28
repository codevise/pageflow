import React from 'react';
import {
  Entry,
  RootProviders,
  setupI18n,
  frontend,
  registerConsentVendors
} from 'pageflow-scrolled/frontend';
import {browser, Consent} from 'pageflow/frontend';

import {normalizeSeed} from 'pageflow-scrolled/testHelpers';
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
 *   rendered as stories. A `themeOptions` property can also be
 *   supplied.
 * @param {boolean} [consent=false] -
 *   Set to true, to include a story which renders the content element
 *   in a state where consent has not yet been given.
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
 *       configuration: {size: 'large'},
 *       themeOptions: {
 *         properties: {
 *           root: {
 *             accentColor: '#0f0'
 *           }
 *         }
 *       }
 *     }
 *   ]
 * });
 */
export function storiesOfContentElement(module, options) {
  const stories = storiesOf(`Content Elements/${options.typeName}`, module);

  if (seedFixture.i18n) {
    setupI18n(seedFixture.i18n);
  }

  exampleStories(options).forEach(({
    title, seed, requireConsentOptIn, cssRules, parameters = {}
  }) => {
    const consent = Consent.create();

    registerConsentVendors({
      seed,
      consent,
      contentElementTypes: frontend.contentElementTypes,
      cookieName: requireConsentOptIn && 'pageflow_consent_storybook'
    });

    stories.add(title,
                () =>
                  <RootProviders seed={seed} consent={consent}>
                    <style>
                      {renderCss(cssRules)}
                    </style>
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

function renderCss(rules) {
  return Object.entries(rules).map(([name, properties]) => {
    const selector = (name === 'root' ? ':root' : `.scope-${name}`);

    const declations = Object.entries(properties).map(([key, value]) =>
      `${key}: ${value};`
    ).join('\n');

    return `
      ${selector} {
        ${declations}
      }
    `
  }).join('\n');
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
    ...mobileExampleStories(options),
    ...consentOptInStories(options)
  ];
}

function variantsExampleStories({typeName, baseConfiguration, variants}) {
  if (!variants) {
    return [];
  }

  return exampleStoryGroup({
    typeName,
    name: 'Variants',
    examples: variants.map(({
      name, configuration, themeOptions, sectionConfiguration
    }) => ({
      name: name,
      contentElementConfiguration: {...baseConfiguration, ...configuration},
      themeOptions,
      sectionConfiguration
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
        name: 'Center Ragged',
        sectionConfiguration: {layout: 'centerRagged'},
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

function consentOptInStories({typeName, consent, baseConfiguration}) {
  if (!consent) {
    return [];
  }

  return exampleStoryGroup({
    typeName,
    name: 'Consent',
    requireConsentOptIn: true,
    examples: [
      {
        name: 'Opt-In',
        contentElementConfiguration: baseConfiguration
      }
    ]
  });
}

function exampleStoryGroup({name, typeName, examples, parameters, requireConsentOptIn}) {
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

  return sections.map((section, index) => ({
    title: `${name} - ${examples[index].name}`,
    seed: normalizeAndMergeFixture({
      sections: [section],
      contentElements: contentElements,
      themeOptions: examples[index].themeOptions
    }),
    requireConsentOptIn,
    parameters,
    cssRules: Object.entries(examples[index].themeOptions?.properties || {}).reduce(
      (result, [scope, properties]) => {
        result[scope] = themeCssProperties(properties);
        return result;
      },
      {}
    )
  }));
}

function themeCssProperties(properties) {
  return Object.keys(properties).reduce((result, key) => {
    result[`--theme-${dasherize(key)}`] = properties[key];
    return result;
  }, {});
}

function dasherize(text) {
  return text.replace(/[A-Z]/g, match =>
    `-${match.toLowerCase()}`
  );
}

export function normalizeAndMergeFixture(options = {}) {
  const seed = normalizeSeed(options);

  return {
    ...seedFixture,
    config: mergeDeep(
      seedFixture.config,
      {theme: {options: options.themeOptions || {}}}
    ),
    collections: {
      ...seedFixture.collections,
      chapters: seed.collections.chapters,
      sections: seed.collections.sections,
      contentElements: seed.collections.contentElements,
      widgets: seed.collections.widgets
    }
  };
}

export function exampleHeading({sectionId, text, position}) {
  return {
    sectionId,
    typeName: 'heading',
    configuration: {
      children: text,
      level: 1,
      position
    }
  }
}

const lorem = 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr. Sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.';

export function exampleTextBlock({sectionId, text = lorem}) {
  return {
    sectionId,
    typeName: 'textBlock',
    configuration: {
      value: [
        {
          type: 'paragraph',
          children: [
            {text}
          ]
        }
      ]
    }
  };
}

export function examplePositionedElement({sectionId, position, width, caption, configuration = {}, typeName = 'inlineImage'}) {
  return {
    sectionId,
    typeName,
    configuration: {
      position,
      width,
      id: null,
      caption,
      ...configuration
    }
  }
}

// This method is only used in specs of this file. I could not find
// anouth way to stub the missing seed.json file.
export function stubSeedFixture(seed) {
  seedFixture = seed;
}

function mergeDeep(target, source) {
  let output = Object.assign({}, target);

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
