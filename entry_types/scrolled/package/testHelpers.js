import { ConfigurationEditorTabView } from 'pageflow/ui';
import { FileInputView } from 'pageflow/editor';
import { render, act } from '@testing-library/react';
import { renderBackboneView, ConfigurationEditor } from 'pageflow/testHelpers';
export { renderBackboneView as renderReactBasedBackboneView } from 'pageflow/testHelpers';
import { EditContentElementView, editor } from 'pageflow-scrolled/editor';
import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BackboneEvents from 'backbone-events-standalone';
import { PhonePlatformContext, RootProviders, useEntryStateDispatch, ContentElementLifecycleContext, ContentElementEditorCommandEmitterContext, ContentElementEditorStateContext, MainStorylineActivity, ContentElementAttributesProvider, ContentElementViewTimelineContext } from 'pageflow-scrolled/frontend';
import { Consent } from 'pageflow/frontend';
import { renderHook } from '@testing-library/react-hooks/dom';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".ContentElementBox-module_properties__1ljc9 {\n  --content-element-box-box-shadow:\n    var(--content-element-box-shadow, 0 0 #000),\n    0 0 0 1px var(--content-element-box-outline-color, transparent);\n}\n\n.ContentElementBox-module_wrapper__3wZgP {\n  overflow: hidden;\n  border-radius: var(--content-element-box-border-radius,\n                     var(--theme-content-element-box-border-radius));\n  box-shadow: var(--content-element-box-box-shadow);\n}\n\n.ContentElementBox-module_full__AfWPr {\n  border-radius: var(--content-element-box-border-radius,\n                     var(--theme-content-element-full-box-border-radius,\n                     var(--theme-content-element-box-border-radius)));\n}\n\n.ContentElementBox-module_positioned__3R1dq {\n  position: relative;\n  height: 100%;\n}\n";
var styles = {"properties":"ContentElementBox-module_properties__1ljc9","wrapper":"ContentElementBox-module_wrapper__3wZgP","full":"ContentElementBox-module_full__AfWPr","positioned":"ContentElementBox-module_positioned__3R1dq"};
styleInject(css);

function getElement(subject) {
  var _subject$el;
  return (_subject$el = subject === null || subject === void 0 ? void 0 : subject.el) !== null && _subject$el !== void 0 ? _subject$el : subject;
}

/**
 * Assert that the subject contains a `ContentElementBox` and, optionally,
 * that the box has specific theme styles applied. Registered via
 * {@link useContentElementMatchers}.
 *
 * The subject is a DOM element, e.g. the `container` returned by
 * {@link renderInContentElement}. Negate with `.not` to assert that no
 * box is present.
 *
 * @param {Object} [options]
 * @param {string} [options.boxShadow] - Expected box shadow theme scale, e.g. `'md'`.
 * @param {string} [options.borderRadius] - Expected border radius theme scale, e.g. `'circle'`.
 * @param {string} [options.outlineColor] - Expected outline color.
 *
 * @example
 * expect(container).toContainContentElementBox();
 * expect(container).toContainContentElementBox({borderRadius: 'circle', boxShadow: 'md'});
 * expect(container).not.toContainContentElementBox();
 */
function toContainContentElementBox(subject, options = {}) {
  const wrapper = getElement(subject).querySelector(`.${styles.wrapper}`);
  if (!wrapper) {
    return {
      pass: false,
      message: () => 'expected element to contain a content element box, but found none'
    };
  }
  const mismatches = boxPropertyMismatches(wrapper, options);
  return {
    pass: mismatches.length === 0,
    message: () => mismatches.length ? `expected content element box to have ${mismatches.join(', ')}` : `expected element not to contain a content element box${describeOptions(options)}`
  };
}
const boxProperties = {
  boxShadow: {
    customProperty: '--content-element-box-shadow',
    expectedValue: value => `var(--theme-content-element-box-shadow-${value})`
  },
  borderRadius: {
    customProperty: '--content-element-box-border-radius',
    expectedValue: value => `var(--theme-content-element-box-border-radius-${value})`
  },
  outlineColor: {
    customProperty: '--content-element-box-outline-color',
    expectedValue: value => value
  }
};
function boxPropertyMismatches(wrapper, options) {
  return Object.keys(options).reduce((mismatches, name) => {
    const property = boxProperties[name];
    if (property) {
      const expected = property.expectedValue(options[name]);
      const actual = wrapper.style.getPropertyValue(property.customProperty);
      if (actual !== expected) {
        mismatches.push(`${name} ${JSON.stringify(options[name])} (found ${JSON.stringify(actual)})`);
      }
    }
    return mismatches;
  }, []);
}
function describeOptions(options) {
  const names = Object.keys(options).filter(name => boxProperties[name]);
  return names.length ? ` with ${names.join(', ')}` : '';
}

var css$1 = ".FitViewport-module_container__-awVj {\n  width: 100%;\n  margin: 0 auto;\n  max-width: var(\n    --theme-fit-viewport,\n    calc(100 * var(--vh) / var(--fit-viewport-aspect-ratio) * var(--fit-viewport-scale, 1))\n  );\n}\n\n.FitViewport-module_content__1_K5a {\n  position: relative;\n}\n\n.FitViewport-module_content__1_K5a > div:first-child {\n  padding-top: calc(100% * var(--fit-viewport-aspect-ratio));\n}\n\n.FitViewport-module_inner__3psd1 {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n\n@media print {\n  .FitViewport-module_container__-awVj {\n    page-break-inside: avoid;\n  }\n}\n";
var styles$1 = {"container":"FitViewport-module_container__-awVj","content":"FitViewport-module_content__1_K5a","inner":"FitViewport-module_inner__3psd1"};
styleInject(css$1);

/**
 * Assert that the subject contains a `FitViewport` and, optionally, that
 * it has a specific aspect ratio. Registered via
 * {@link useContentElementMatchers}.
 *
 * The subject is a DOM element, e.g. the `container` returned by
 * {@link renderInContentElement}. Negate with `.not` to assert that no
 * `FitViewport` is present.
 *
 * @param {Object} [options]
 * @param {string} [options.aspectRatio] -
 *   Expected aspect ratio: a theme scale name (e.g. `'square'`) or a raw
 *   ratio value (e.g. `'0.75'`).
 *
 * @example
 * expect(container).toContainFitViewport();
 * expect(container).toContainFitViewport({aspectRatio: 'square'});
 */
function toContainFitViewport(subject, {
  aspectRatio
} = {}) {
  const container = getElement(subject).querySelector(`.${styles$1.container}`);
  if (!container) {
    return {
      pass: false,
      message: () => 'expected element to contain a FitViewport, but found none'
    };
  }
  if (aspectRatio !== undefined) {
    const actual = getAspectRatio(container);
    if (actual !== aspectRatio) {
      return {
        pass: false,
        message: () => `expected FitViewport to have aspect ratio ${JSON.stringify(aspectRatio)} ` + `(found ${JSON.stringify(actual)})`
      };
    }
  }
  return {
    pass: true,
    message: () => 'expected element not to contain a FitViewport'
  };
}
function getAspectRatio(container) {
  const cssValue = container.style.getPropertyValue('--fit-viewport-aspect-ratio');
  const match = cssValue.match(/var\(--theme-aspect-ratio-(.+)\)/);
  return match ? match[1] : cssValue;
}

/**
 * Assert that all inputs rendered by a configuration editor are
 * described by a configuration schema. Registered via
 * {@link useConfigurationEditorMatchers}.
 *
 * The subject is a function that renders the configuration editor. Only
 * inputs of the rendered form are seen. Views on nested routes render a
 * form of their own and are checked against the part of the schema that
 * describes the object they configure.
 *
 * @param {Object} schema - Configuration schema of the subject.
 * @param {Object} [options]
 * @param {Array<string>} [options.path] - Path of the configuration the
 *   rendered form writes, if it is not the root. `*` stands for array
 *   items and map values.
 *
 * @example
 * expect(() => renderContentElementConfigurationEditor({entry, contentElement}))
 *   .toRenderInputsMatching(require('./schema.json'));
 *
 * @example
 * expect(() => renderBackboneView(new SidebarEditAreaView(options)))
 *   .toRenderInputsMatching(require('../schema.json'), {path: ['areas', '*']});
 */
function toRenderInputsMatching(render, schema, {
  path = []
} = {}) {
  const subschema = subschemaAt(schema, path);
  if (!subschema) {
    return {
      pass: false,
      message: () => `expected schema to describe configuration at ${path.join('/')}`
    };
  }
  const inputs = recordInputs(render);
  if (!inputs.length) {
    return {
      pass: false,
      message: () => 'expected configuration editor to render inputs, but it rendered none'
    };
  }
  const mismatches = inputs.flatMap(input => mismatchesOf(input, subschema));
  return {
    pass: mismatches.length === 0,
    message: () => mismatches.length ? `expected rendered inputs to match schema:\n  ${mismatches.join('\n  ')}` : 'expected rendered inputs not to match schema'
  };
}
function subschemaAt(schema, path) {
  return path.reduce((current, segment) => dereference(child(current, segment), schema), dereference(schema, schema));
}
function child(schema, segment) {
  var _schema$properties;
  if (!schema) {
    return undefined;
  }
  return segment === '*' ? schema.items || schema.additionalProperties : (_schema$properties = schema.properties) === null || _schema$properties === void 0 ? void 0 : _schema$properties[segment];
}
function dereference(schema, document) {
  var _schema2;
  const seen = [];
  while (((_schema = schema) === null || _schema === void 0 ? void 0 : _schema.$ref) && !seen.includes(schema.$ref)) {
    var _schema;
    seen.push(schema.$ref);
    schema = localTarget(document, schema.$ref);
  }
  return ((_schema2 = schema) === null || _schema2 === void 0 ? void 0 : _schema2.$ref) ? undefined : schema;
}
function localTarget(document, ref) {
  const [otherDocumentId, pointer] = ref.split('#');
  if (otherDocumentId) {
    return undefined;
  }
  return pointer.split('/').filter(Boolean).reduce((value, segment) => value === null || value === void 0 ? void 0 : value[segment], document);
}
function recordInputs(render) {
  const inputs = [];
  const input = ConfigurationEditorTabView.prototype.input;
  jest.spyOn(ConfigurationEditorTabView.prototype, 'input').mockImplementation(function (propertyName, view, options = {}) {
    inputs.push({
      propertyName,
      view,
      options
    });
    return input.call(this, propertyName, view, options);
  });
  try {
    render();
  } finally {
    ConfigurationEditorTabView.prototype.input.mockRestore();
  }
  return inputs;
}
const checks = [fileCollectionMismatch];
function mismatchesOf({
  propertyName,
  view,
  options
}, schema) {
  const property = (schema.properties || {})[propertyName];
  return checks.flatMap(check => check({
    propertyName,
    view,
    options,
    property
  }) || []);
}
function fileCollectionMismatch({
  propertyName,
  view,
  options,
  property
}) {
  if (!isFileInput(view) || !options.collection) {
    return;
  }
  const declared = property && property['x-fileCollection'];
  if (declared !== options.collection) {
    return `${propertyName}: expected x-fileCollection ${JSON.stringify(options.collection)}, ` + `found ${JSON.stringify(declared)}`;
  }
}
function isFileInput(view) {
  return view === FileInputView || view.prototype instanceof FileInputView;
}

/**
 * Register the public content element matchers for the surrounding
 * `describe` block: {@link toContainContentElementBox} and
 * {@link toContainFitViewport}.
 *
 * Call inside a `describe` block. Content element plugins can use this to
 * assert that their component opts into the framework chrome correctly.
 *
 * @example
 * import {renderInContentElement, useContentElementMatchers} from 'pageflow-scrolled/testHelpers';
 *
 * describe('MyContentElement', () => {
 *   useContentElementMatchers();
 *
 *   it('renders inside a box', () => {
 *     const {container} = renderInContentElement(<MyContentElement />);
 *     expect(container).toContainContentElementBox();
 *   });
 * });
 */
function useContentElementMatchers() {
  beforeEach(() => {
    expect.extend({
      toContainContentElementBox,
      toContainFitViewport
    });
  });
}

/**
 * Register the configuration editor matchers for the surrounding
 * `describe` block: {@link toRenderInputsMatching}.
 *
 * Call inside a `describe` block. Content element plugins can use this to
 * assert that their configuration schema keeps up with their editor
 * integration.
 *
 * @example
 * import {
 *   renderContentElementConfigurationEditor, useConfigurationEditorMatchers
 * } from 'pageflow-scrolled/testHelpers';
 *
 * describe('myContentElement/editor', () => {
 *   useConfigurationEditorMatchers();
 *
 *   it('renders inputs described by schema', () => {
 *     expect(() => renderContentElementConfigurationEditor({entry, contentElement}))
 *       .toRenderInputsMatching(schema);
 *   });
 * });
 */
function useConfigurationEditorMatchers() {
  beforeEach(() => {
    expect.extend({
      toRenderInputsMatching
    });
  });
}

/**
 * Construct data structure that resembles seed generated by server
 * side JBuilder templates.
 *
 * @param {Object} [options]
 * @param {Object} [options.imageFileUrlTemplates] - Mapping of url template names to url templates.
 * @param {String} [options.prettyUrl] - The entry's url (Default share url).
 * @param {Object} [options.shareUrlTemplates] - Mapping of share provider names to sharing urls.
 * @param {String} [options.defaultFileRights] - Default file rights of entry's account.
 * @param {Object} [options.legalInfo] - imprint, copyright and privacy information of entry.
 * @param {Object} [options.themeOptions] - Options set via theme registration.
 * @param {Object} [options.themeAssets] - Paths to theme assets.
 * @param {Object} [options.themeTranslations] - Pre-merged theme translations (e.g., scales).
 * @param {Object} [options.additionalSeedData] - Seed data by name.
 * @param {Array} [options.consentVendors] - Server rendered consent vendor data.
 * @param {Object} [options.contentElementConsentVendors] - Consent vendor name by content element id.
 * @param {Object} [options.entry] - attributes of entry.
 * @param {Object} [options.fileModelTypes] - Mapping of file collection names to model types.
 *   Only needed to associate nested files with their parent. Collections of file types
 *   registered by plugins get a placeholder model type.
 * @param {Object} [options.fileUrlTemplates] - Mapping of file collection names to mappings of
 *   url template names to url templates.
 * @param {Array} [options.imageFiles] - Array of objects with image file attributes of entry.
 * @param {Array} [options.videoFiles] - Array of objects with video file attributes of entry.
 * @param {Array} [options.audioFiles] - Array of objects with audio file attributes of entry.
 * @param {Array} [options.textTrackFiles] - Array of objects with text track file attributes of entry.
 * @param {Array} [options.storylines] - Array of objects with storyline attributes of entry.
 * @param {Array} [options.chapters] - Array of objects with chapter attributes of entry.
 * @param {Array} [options.sections] - Array of objects with section attributes of entry.
 * @param {Array} [options.contentElements] - Array of objects with content element attributes of entry.
 * @param {Array} [options.widgets] - Array of objects with widget attributes of entry.
 * @returns {Object} - Data that resembles seed generated by server side rendering.
 */
function normalizeSeed({
  imageFileUrlTemplates,
  fileUrlTemplates,
  fileModelTypes,
  prettyUrl,
  shareUrlTemplates,
  defaultFileRights,
  legalInfo,
  themeOptions,
  themeAssets,
  themeTranslations,
  entry,
  imageFiles,
  videoFiles,
  audioFiles,
  textTrackFiles,
  storylines,
  chapters,
  sections,
  contentElements,
  widgets,
  additionalSeedData,
  consentVendors,
  contentElementConsentVendors,
  cutOff,
  embed,
  originUrl,
  fileLicenses,
  entryTranslations,
  fileReferenceLocations,
  ...customFiles
} = {}) {
  const customFileCollectionNames = [...new Set([...Object.keys(customFiles).filter(name => name.endsWith('Files')), ...Object.keys(fileModelTypes || {})])].filter(name => !builtInFileCollectionNames.includes(name));
  const entries = entry ? [entry] : [{}];
  const normalizedEntries = normalizeCollection(entries, {
    locale: 'en',
    configuration: {}
  });
  const normalizedContentElements = normalizeCollection(contentElements, {
    typeName: 'textBlock',
    configuration: {}
  });
  const normalizedSections = normalizeSections(sections, normalizedContentElements);
  const normalizedChapters = normalizeChapters(chapters, normalizedSections);
  const normalizedStorylines = normalizeStorylines(storylines, normalizedChapters);
  return {
    config: {
      fileUrlTemplates: {
        imageFiles: {
          ...imageFileUrlTemplates
        },
        videoFiles: {},
        audioFiles: {},
        textTrackFiles: {},
        ...emptyUrlTemplates(customFileCollectionNames),
        ...fileUrlTemplates
      },
      fileModelTypes: {
        audioFiles: 'Pageflow::AudioFile',
        imageFiles: 'Pageflow::ImageFile',
        textTrackFiles: 'Pageflow::TextTrackFile',
        videoFiles: 'Pageflow::VideoFile',
        ...placeholderModelTypes(customFileCollectionNames),
        ...fileModelTypes
      },
      prettyUrl: prettyUrl,
      shareUrlTemplates: normalizeShareUrlTemplates(shareUrlTemplates),
      defaultFileRights: defaultFileRights,
      legalInfo: normalizeLegalInfo(legalInfo),
      theme: normalizeTheme({
        themeOptions,
        themeAssets,
        themeTranslations
      }),
      additionalSeedData: additionalSeedData || {},
      consentVendors: consentVendors || [],
      contentElementConsentVendors: contentElementConsentVendors || {},
      cutOff,
      embed,
      originUrl,
      fileLicenses: fileLicenses || {},
      entryTranslations: entryTranslations || [],
      fileReferenceLocations: normalizeFileReferenceLocations(fileReferenceLocations)
    },
    collections: {
      entries: normalizedEntries,
      imageFiles: normalizeCollection(imageFiles, {
        isReady: true,
        basename: 'image',
        extension: 'jpg',
        width: 1920,
        height: 1279,
        configuration: {}
      }),
      videoFiles: normalizeCollection(videoFiles, {
        isReady: true,
        width: 1920,
        height: 1279,
        configuration: {}
      }),
      audioFiles: normalizeCollection(audioFiles, {
        isReady: true,
        configuration: {}
      }),
      textTrackFiles: normalizeCollection(textTrackFiles, {
        parentFileId: null,
        parentFileType: null,
        configuration: {}
      }),
      ...customFileCollections(customFileCollectionNames, customFiles),
      storylines: normalizedStorylines,
      chapters: normalizedChapters,
      sections: normalizedSections,
      contentElements: normalizedContentElements,
      widgets: normalizeWidgets(widgets)
    }
  };
}
const builtInFileCollectionNames = ['imageFiles', 'videoFiles', 'audioFiles', 'textTrackFiles'];

// Model types are only compared to associate nested files with their
// parent. Specs that seed nested files need to pass the real model type
// via the fileModelTypes option.
function placeholderModelTypes(collectionNames) {
  return Object.fromEntries(collectionNames.map(name => [name, name.replace(/Files$/, 'File').replace(/^./, letter => letter.toUpperCase())]));
}
function emptyUrlTemplates(collectionNames) {
  return Object.fromEntries(collectionNames.map(name => [name, {}]));
}
function customFileCollections(collectionNames, customFiles) {
  return Object.fromEntries(collectionNames.map(name => [name, normalizeCollection(customFiles[name], {
    isReady: true,
    configuration: {}
  })]));
}
function normalizeSections(sections = [], contentElements) {
  const sectionDefaults = {
    configuration: {
      transition: 'scroll',
      backdrop: {
        image: '#000'
      }
    }
  };
  if (contentElements.length && !sections.length) {
    contentElements.forEach(contentElement => contentElement.sectionId = 10);
    return [{
      id: 10,
      permaId: 1,
      ...sectionDefaults
    }];
  }
  return normalizeCollection(sections, sectionDefaults).map(section => ({
    ...section,
    configuration: {
      transition: sectionDefaults.configuration.transition,
      ...section.configuration
    }
  }));
}
function normalizeChapters(chapters = [], sections) {
  const chapterDefaults = {
    configuration: {}
  };
  if (sections.length && !chapters.length) {
    sections.forEach(section => section.chapterId = 100);
    return [{
      id: 100,
      permaId: 10,
      ...chapterDefaults
    }];
  }
  return normalizeCollection(chapters, chapterDefaults);
}
function normalizeStorylines(storylines = [], chapters) {
  if (!storylines.length) {
    chapters.forEach(chapter => chapter.storylineId = 1000);
    return [{
      id: 1000,
      permaId: 100,
      configuration: {
        main: true
      }
    }];
  }
  return normalizeCollection(storylines, {
    configuration: {}
  });
}
function normalizeShareUrlTemplates(shareUrlTemplates) {
  if (shareUrlTemplates) {
    return shareUrlTemplates;
  } else {
    return {
      email: 'mailto:?body=%<url>s',
      facebook: 'http://www.facebook.com/sharer/sharer.php?u=%<url>s',
      google: 'https://plus.google.com/share?url=%<url>s',
      linked_in: 'https://www.linkedin.com/shareArticle?mini=true&url=%<url>s',
      telegram: 'tg://msg?text=%<url>s',
      twitter: 'https://x.com/intent/post?url=%<url>s',
      whats_app: 'WhatsApp://send?text=%<url>s'
    };
  }
}
function normalizeLegalInfo(legalInfo) {
  if (legalInfo) {
    return legalInfo;
  } else {
    return {
      imprint: {
        label: '',
        url: ''
      },
      copyright: {
        label: '',
        url: ''
      },
      privacy: {
        label: '',
        url: ''
      }
    };
  }
}
function normalizeTheme({
  themeAssets,
  themeOptions,
  themeTranslations
}) {
  return {
    assets: {
      icons: {},
      ...themeAssets
    },
    options: {
      colors: {},
      ...themeOptions
    },
    translations: themeTranslations
  };
}
function normalizeWidgets(widgets = []) {
  return widgets.map(widget => ({
    permaId: widget.role,
    configuration: {},
    ...widget
  }));
}
function normalizeCollection(collection = [], defaults = {}) {
  return collection.map((item, index) => ({
    id: index + 1,
    permaId: index + 1,
    ...defaults,
    ...item
  }));
}
function normalizeFileReferenceLocations(fileReferenceLocations) {
  return {
    contentElements: {},
    sections: [],
    entry: [],
    ...fileReferenceLocations
  };
}

/**
 * Render the configuration editor of a content element. Content element
 * packs can use this to assert how their editor integration behaves.
 *
 * @param {Object} options
 * @param {Object} options.entry - Entry the content element belongs to.
 * @param {Object} options.contentElement - Content element to configure.
 *
 * @example
 * import {renderContentElementConfigurationEditor} from 'pageflow-scrolled/testHelpers';
 */
function renderContentElementConfigurationEditor({
  entry,
  contentElement
}) {
  // Normally contributed by the text inline file rights widget type
  // once the widgets of the entry have been set up.
  ConfigurationEditorTabView.groups.define('ContentElementInlineFileRightsSettings', () => {});
  const view = new EditContentElementView({
    model: contentElement,
    editor,
    entry
  });
  renderBackboneView(view);
  return ConfigurationEditor.find(view);
}

/**
 * Render a component that depends on entry state. Accepts all options
 * supported by [`render` of
 * `@testing-library/react`](https://testing-library.com/docs/react-testing-library/api#render).
 *
 * The `seed` option can be used to simulate rendering the component
 * in the published entry. Data passed in this option would normally
 * be rendered in a server side JBuilder template.
 *
 * The `setup` option can be used to simulate rendering the component
 * in the editor where data is synchronized from Backbone models.
 *
 * To be able to render components that expect the result of certain
 * hooks as part of their props, instead of a React component, you can
 * pass a function returning a React component as first parameter. The
 * function will be evaluated in a context of a React component and
 * can thus make use of hooks
 *
 *     // DOES NOT WORK
 *     renderInEntry(<Image file={useFile({collectionName: 'imageFiles', permaId: 4})} />, {seed});
 *
 *     // WORKS
 *     renderInEntry(() => <Image file={useFile({collectionName: 'imageFiles', permaId: 4})} />, {seed});
 *
 * When using the `rerender` function from the result, you again need
 * to use the same type of parameter you passed to the original
 * `renderInEntry` call.
 *
 * @param {React.Component|Function} ui - React component or function returning a React component
 * @param {Object} [options]
 * @param {Object} [options.seed] - Seed data for entry state. Passed through {@link normalizeSeed}.
 * @param {Function} [options.setup] -
 *   Function that gets called with the internal entry state dispatch
 *   function. The normalized seed constructed from the `seed` option
 *   is passed as a second parameter.
 */
function renderInEntry(ui, {
  seed,
  setup,
  wrapper,
  consent = Consent.create(),
  phonePlatform,
  ...options
} = {}) {
  options = {
    wrapper: createWrapper(seed, setup, wrapper, consent, phonePlatform),
    ...options
  };
  if (typeof ui === 'function') {
    // Evaluate `ui` inside a React component to allow using hooks in
    // the test. We also could have used `ui` as a React component
    // directly (e.g. `React.createElement(ui)`). But when calling
    // `rerender` with a different function than the one passed to the
    // original `renderInEntry` call, e.g.
    //
    //   const {rerender} = renderInEntry(() => <MyComponent someProp={1} />);
    //   rerender(() => <MyComponent someProp={2} />);
    //
    // React would unmount the `MyComponent` component from the first
    // render call and mount a new one. We therefore define a single
    // component that is reused across rerenders to ensure
    // `MyComponent` stays mounted and just receives new props.
    function HooksWrapper({
      ui
    }) {
      return ui();
    }
    const result = render( /*#__PURE__*/React.createElement(HooksWrapper, {
      ui: ui
    }), options);
    return {
      ...result,
      rerender(ui) {
        result.rerender( /*#__PURE__*/React.createElement(HooksWrapper, {
          ui: ui
        }));
      }
    };
  } else {
    return render(ui, options);
  }
}

/**
 * Render a hook that depends on entry state.  Accepts all options
 * supported by [`renderHook` of
 * `@testing-library/react-hooks`](https://react-hooks-testing-library.com/reference/api)
 *
 * Can be used to test selector hooks which extract information from
 * the entry state.
 *
 * @param {Function} callback - Function that calls the hook.
 * @param {Object} [options]
 * @param {Object} [options.seed] - Seed data for entry state. Passed through {@link normalizeSeed}.
 * @param {Function} [options.setup] - See {@link renderInEntry}.
 */
function renderHookInEntry(callback, {
  seed,
  setup,
  wrapper,
  phonePlatform,
  ...options
} = {}) {
  return renderHook(callback, {
    wrapper: createWrapper(seed, setup, wrapper, undefined, phonePlatform),
    ...options
  });
}
function createWrapper(seed, setup, originalWrapper, consent, phonePlatform) {
  const normalizedSeed = normalizeSeed(seed);
  const OriginalWrapper = originalWrapper || function Noop({
    children
  }) {
    return children;
  };
  return function Wrapper({
    children
  }) {
    let content = /*#__PURE__*/React.createElement(Dispatcher, {
      callback: setup,
      seed: normalizedSeed
    }, /*#__PURE__*/React.createElement(OriginalWrapper, null, children));
    if (phonePlatform !== undefined) {
      content = /*#__PURE__*/React.createElement(PhonePlatformContext.Provider, {
        value: phonePlatform
      }, content);
    }
    return /*#__PURE__*/React.createElement(RootProviders, {
      seed: normalizedSeed,
      consent: consent
    }, content);
  };
}
function Dispatcher({
  children,
  seed,
  callback
}) {
  const dispatch = useEntryStateDispatch();
  useEffect(() => {
    if (callback) {
      callback(dispatch, seed);
    }
  }, [dispatch, seed, callback]);
  return children;
}

/**
 * Takes the same options as {@link renderInEntry} but returns
 * additional helper function to the return value of the
 * {@link `useContentElementLifecycle`} hook:
 *
 *     const {simulateScrollPosition} = renderInEntry(...)
 *     simulateScrollPosition('near viewport')
 *     // => Turns `shouldLoad` and `shouldPrepare` to true
 */
function renderInEntryWithContentElementLifecycle(ui, options) {
  return renderInEntryWithScrollPositionLifecycle(ui, {
    lifecycleContext: ContentElementLifecycleContext,
    ...options
  });
}
function renderInEntryWithScrollPositionLifecycle(ui, {
  lifecycleContext,
  wrapper,
  ...options
} = {}) {
  const emitter = createEmitter();
  return withSimulateScrollPositionHelper(emitter, renderInEntry(ui, {
    wrapper: createScrollPositionProvider(lifecycleContext, emitter, wrapper),
    ...options
  }));
}
function createScrollPositionProvider(Context, emitter, originalWrapper) {
  const OriginalWrapper = originalWrapper || function Noop({
    children
  }) {
    return children;
  };
  return function ScrollPositionProvider({
    children
  }) {
    const [value, setValue] = useState({
      shouldLoad: false,
      shouldPrepare: false,
      isVisible: false,
      isActive: false
    });
    useEffect(() => {
      function handle(scrollPosition) {
        switch (scrollPosition) {
          case 'near viewport':
            setValue({
              shouldLoad: true,
              shouldPrepare: true,
              isVisible: false,
              isActive: false
            });
            break;
          case 'in viewport':
            setValue({
              shouldLoad: true,
              shouldPrepare: true,
              isVisible: true,
              isActive: false
            });
            break;
          case 'center of viewport':
            setValue({
              shouldLoad: true,
              shouldPrepare: true,
              isVisible: true,
              isActive: true
            });
            break;
          default:
            setValue({
              isVisible: false,
              isActive: false
            });
            break;
        }
      }
      emitter.on('scroll', handle);
      return () => emitter.off('scroll', handle);
    });
    return /*#__PURE__*/React.createElement(OriginalWrapper, null, /*#__PURE__*/React.createElement(Context.Provider, {
      value: value
    }, children));
  };
}
const allowedScrollPositions = ['outside viewport', 'near viewport', 'in viewport', 'center of viewport'];
function withSimulateScrollPositionHelper(emitter, result) {
  return {
    ...result,
    simulateScrollPosition(scrollPosition) {
      if (!allowedScrollPositions.includes(scrollPosition)) {
        throw new Error(`Invalid scrollPosition '${scrollPosition}'. ` + `Allowed values: ${allowedScrollPositions.join(', ')}`);
      }
      act(() => {
        emitter.trigger('scroll', scrollPosition);
      });
    }
  };
}
function createEmitter() {
  return {
    ...BackboneEvents
  };
}

/**
 * Provide context as if component was rendered inside of a content element.
 *
 * Returns additional functions to control content element scroll
 * lifecycle, view timeline progress, editor commands, and storyline
 * mode: `simulateScrollPosition`, `simulateScrollProgress`,
 * `triggerEditorCommand`, and `simulateStorylineMode`.
 *
 * `simulateScrollProgress` passes the given progress to all
 * `useContentElementViewTimelineProgress` callbacks, no matter which
 * range they observe. Pass a `range` option to only invoke callbacks
 * observing that range.
 *
 * @param {Function} callback - React component or function returning a React component.
 * @param {Object} [options] - Supports all options supported by {@link `renderInEntry`}.
 * @param {boolean|Object} [options.inlineEditing] -
 *   Opt the content element into an inline-editing context (matching
 *   what's available when inline editing is loaded in production).
 *   Pass `true` for editable defaults, or an object to override:
 *   `{isEditable, isSelected, transientState}`. `transientState` is
 *   installed as the `setTransientState` function on the editor state
 *   context — pass a jest spy to assert on it. Omitting the option
 *   gives the frontend-mode defaults (`isEditable: false, isSelected:
 *   false, setTransientState: noop`) without wrapping any
 *   inline-editing-only providers (DndProvider, editor command
 *   emitter).
 * @param {Object} [options.phonePlatform] - Fake result of `usePhonePlatform`.
 * @param {Object} [options.consentState] - Pass 'undecided' to render third party consent opt in.
 *
 * @example
 *
 * const {getByRole, simulateScrollPosition, triggerEditorCommand, simulateStorylineMode} =
 *   renderInContentElement(<MyContentElement />, {
 *     seed: {...},
 *     inlineEditing: {isSelected: true}
 *   });
 * simulateScrollPosition('near viewport');
 * simulateScrollProgress(0.5);
 * simulateScrollProgress(0.5, {range: 'pinned'});
 * triggerEditorCommand({type: 'HIGHLIGHT'});
 * simulateStorylineMode('background');
 */
function renderInContentElement(ui, {
  inlineEditing,
  phonePlatform = false,
  wrapper: OriginalWrapper,
  consentState = 'accepted',
  seed,
  ...options
} = {}) {
  const emitter = Object.assign({}, BackboneEvents);
  const storylineEmitter = Object.assign({}, BackboneEvents);
  const viewTimelineEmitter = Object.assign({}, BackboneEvents);
  const viewTimeline = {
    subscribe(range, callback) {
      function handleProgress(progress, options) {
        if (!options.range || options.range === range) {
          callback(progress);
        }
      }
      viewTimelineEmitter.on('progress', handleProgress);
      return () => viewTimelineEmitter.off('progress', handleProgress);
    }
  };
  const inlineEditingConfig = resolveInlineEditing(inlineEditing);
  function Wrapper({
    children
  }) {
    const [storylineMode, setStorylineMode] = useState('active');
    useEffect(() => {
      storylineEmitter.on('storylineMode', setStorylineMode);
      return () => storylineEmitter.off('storylineMode', setStorylineMode);
    }, []);
    let tree = OriginalWrapper ? /*#__PURE__*/React.createElement(OriginalWrapper, {
      children: children
    }) : children;
    if (inlineEditingConfig) {
      tree = /*#__PURE__*/React.createElement(DndProvider, {
        backend: HTML5Backend
      }, /*#__PURE__*/React.createElement(ContentElementEditorCommandEmitterContext.Provider, {
        value: emitter
      }, /*#__PURE__*/React.createElement(ContentElementEditorStateContext.Provider, {
        value: inlineEditingConfig
      }, tree)));
    }
    return /*#__PURE__*/React.createElement(MainStorylineActivity, {
      activeExcursion: storylineMode !== 'active' ? {
        id: 1
      } : null
    }, /*#__PURE__*/React.createElement(ContentElementAttributesProvider, {
      id: 42
    }, /*#__PURE__*/React.createElement(ContentElementViewTimelineContext.Provider, {
      value: viewTimeline
    }, tree)));
  }
  return {
    ...renderInEntryWithScrollPositionLifecycle(ui, {
      lifecycleContext: ContentElementLifecycleContext,
      wrapper: Wrapper,
      consent: createConsent(consentState),
      phonePlatform,
      seed: {
        ...consentSeed,
        ...seed
      },
      ...options
    }),
    triggerEditorCommand(command) {
      act(() => {
        emitter.trigger(`command:42`, command);
      });
    },
    simulateStorylineMode(mode) {
      act(() => {
        storylineEmitter.trigger('storylineMode', mode);
      });
    },
    simulateScrollProgress(progress, {
      range
    } = {}) {
      act(() => {
        viewTimelineEmitter.trigger('progress', progress, {
          range
        });
      });
    }
  };
}
function resolveInlineEditing(option) {
  var _overrides$isEditable, _overrides$isSelected, _overrides$transientS;
  if (!option) return null;
  const overrides = option === true ? {} : option;
  return {
    isEditable: (_overrides$isEditable = overrides.isEditable) !== null && _overrides$isEditable !== void 0 ? _overrides$isEditable : true,
    isSelected: (_overrides$isSelected = overrides.isSelected) !== null && _overrides$isSelected !== void 0 ? _overrides$isSelected : false,
    setTransientState: (_overrides$transientS = overrides.transientState) !== null && _overrides$transientS !== void 0 ? _overrides$transientS : () => {},
    select: () => {},
    selectNewThread: () => {}
  };
}
function createConsent(consentState) {
  const consent = Consent.create();
  consent.registerVendor('testVendor', {
    displayName: 'Test Vendor',
    description: 'Test embeds',
    paradigm: 'lazy opt-in'
  });
  consent.closeVendorRegistration();
  if (consentState === 'accepted') {
    consent.accept('testVendor');
  }
  return consent;
}
const consentSeed = {
  consentVendors: [{
    name: 'testVendor',
    paradigm: 'lazy opt-in'
  }],
  contentElementConsentVendors: {
    42: 'testVendor'
  }
};

export { normalizeSeed, renderContentElementConfigurationEditor, renderHookInEntry, renderInContentElement, renderInEntry, renderInEntryWithContentElementLifecycle, renderInEntryWithScrollPositionLifecycle, useConfigurationEditorMatchers, useContentElementMatchers };
