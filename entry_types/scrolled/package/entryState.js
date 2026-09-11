import React, { useReducer, useMemo, useCallback } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { createSelectorCreator, defaultMemoize, createSelector } from 'reselect';
import slugify from 'slugify';
import { features } from 'pageflow/frontend';

const PREFIX = 'PAGEFLOW_SCROLLED_COLLECTION';
const RESET = `${PREFIX}_RESET`;
const ADD = `${PREFIX}_ADD`;
const CHANGE = `${PREFIX}_CHANGE`;
const PATCH_CONFIGURATION = `${PREFIX}_PATCH_CONFIGURATION`;
const REMOVE = `${PREFIX}_REMOVE`;
const SORT = `${PREFIX}_SORT`;
function useCollections(seed = {}, {
  keyAttribute
} = {}) {
  return useReducer(reducer, Object.keys(seed).reduce((result, key) => {
    result[key] = init(seed[key], keyAttribute);
    return result;
  }, {}));
}
function reducer(state, action) {
  const collectionName = action.payload.collectionName;
  const keyAttribute = action.payload.keyAttribute;
  switch (action.type) {
    case RESET:
      return {
        ...state,
        [collectionName]: init(action.payload.items, keyAttribute)
      };
    case ADD:
      return {
        ...state,
        [collectionName]: {
          order: action.payload.order,
          items: {
            ...state[collectionName].items,
            [action.payload.attributes[keyAttribute]]: action.payload.attributes
          }
        }
      };
    case CHANGE:
      return {
        ...state,
        [collectionName]: {
          order: state[collectionName].order,
          items: {
            ...state[collectionName].items,
            [action.payload.attributes[keyAttribute]]: action.payload.attributes
          }
        }
      };
    case PATCH_CONFIGURATION:
      const key = action.payload.key;
      return {
        ...state,
        [collectionName]: {
          order: state[collectionName].order,
          items: {
            ...state[collectionName].items,
            [key]: {
              ...state[collectionName].items[key],
              configuration: {
                ...state[collectionName].items[key].configuration,
                ...action.payload.configuration
              }
            }
          }
        }
      };
    case REMOVE:
      const clonedItems = {
        ...state[collectionName].items
      };
      delete clonedItems[action.payload.key];
      return {
        ...state,
        [collectionName]: {
          order: action.payload.order,
          items: clonedItems
        }
      };
    case SORT:
      return {
        ...state,
        [collectionName]: {
          order: action.payload.order,
          items: state[collectionName].items
        }
      };
    default:
      return state;
  }
}
function init(items, keyAttribute = 'id') {
  items = items.filter(item => item[keyAttribute]);
  return {
    order: items.map(item => item[keyAttribute]),
    items: items.reduce((result, item) => {
      result[item[keyAttribute]] = item;
      return result;
    }, {})
  };
}
function updateConfiguration({
  dispatch,
  name,
  key,
  configuration
}) {
  dispatch({
    type: PATCH_CONFIGURATION,
    payload: {
      collectionName: name,
      key,
      configuration
    }
  });
}
function collectionSnapshot(collection, {
  attributes,
  includeConfiguration
}) {
  return collection.map(model => getAttributes(model, {
    attributeNames: attributes,
    includeConfiguration
  }));
}
function watchCollection(collection, {
  name,
  dispatch,
  attributes,
  includeConfiguration,
  keyAttribute = 'id'
}) {
  const handle = {};
  const options = {
    attributeNames: attributes,
    includeConfiguration
  };
  let tearingDown = false;
  const watchedAttributeNames = getWatchedAttributeNames(attributes);
  const sourceKeyAttribute = findSourceAttributeName(attributes, keyAttribute);
  dispatch({
    type: RESET,
    payload: {
      collectionName: name,
      keyAttribute: keyAttribute,
      items: collection.map(model => getAttributes(model, options))
    }
  });
  collection.on('add change:id', model => {
    if (!model.isNew()) {
      dispatch({
        type: ADD,
        payload: {
          collectionName: name,
          keyAttribute: keyAttribute,
          order: collection.pluck(sourceKeyAttribute).filter(Boolean),
          attributes: getAttributes(model, options)
        }
      });
    }
  }, handle);
  collection.on('change', model => {
    if (hasChangedAttributes(model, watchedAttributeNames) && !model.isNew()) {
      dispatch({
        type: CHANGE,
        payload: {
          collectionName: name,
          keyAttribute: keyAttribute,
          attributes: getAttributes(model, options)
        }
      });
    }
  }, handle);
  if (includeConfiguration) {
    collection.on('change:configuration', (model, value, {
      ignoreInWatchCollection
    } = {}) => {
      if (!model.isNew() && !ignoreInWatchCollection) {
        dispatch({
          type: CHANGE,
          payload: {
            collectionName: name,
            keyAttribute: keyAttribute,
            attributes: getAttributes(model, options)
          }
        });
      }
    }, handle);
  }
  collection.on('remove', model => {
    if (!tearingDown && !model.isNew()) {
      dispatch({
        type: REMOVE,
        payload: {
          collectionName: name,
          order: collection.pluck(sourceKeyAttribute).filter(Boolean),
          key: model.attributes[sourceKeyAttribute]
        }
      });
    }
  }, handle);
  collection.on('sort', model => dispatch({
    type: SORT,
    payload: {
      collectionName: name,
      order: collection.pluck(sourceKeyAttribute).filter(Boolean)
    }
  }), handle);
  return function () {
    tearingDown = true;
    collection.off(null, null, handle);
  };
}
function findSourceAttributeName(attributeNames, targetAttributeName) {
  const mapping = attributeNames.find(attributeName => typeof attributeName === 'object' && mappedAttributeTarget(attributeName) === targetAttributeName);
  return mapping ? mappedAttributeSource(mapping) : targetAttributeName;
}
function hasChangedAttributes(model, attributeNames) {
  return attributeNames.some(attributeName => model.hasChanged(attributeName));
}
function getWatchedAttributeNames(attributeNames) {
  return attributeNames.flatMap(attributeName => typeof attributeName == 'object' ? mappedAttributeSource(attributeName) : attributeName);
}
function mappedAttributeSource(mapping) {
  const attributeName = Object.keys(mapping)[0];
  const source = mapping[attributeName];
  if (typeof source === 'string') {
    return source;
  } else if (Array.isArray(source)) {
    return source.slice(0, -1);
  } else {
    return attributeName;
  }
}
function mappedAttributeTarget(attributeName) {
  return Object.keys(attributeName)[0];
}
function getAttributes(model, {
  attributeNames,
  includeConfiguration
}) {
  const result = attributeNames.reduce((result, attributeName) => {
    if (typeof attributeName == 'object') {
      const key = Object.keys(attributeName)[0];
      const value = attributeName[key];
      if (Array.isArray(value)) {
        const attributeNames = value.slice(0, -1);
        const fn = value[value.length - 1];
        result[key] = fn.apply(null, attributeNames.map(attributeName => model.get(attributeName)));
      } else if (typeof value == 'function') {
        result[key] = value(model.get(key));
      } else {
        result[key] = model.get(value);
      }
    } else {
      result[attributeName] = model.get(attributeName);
    }
    return result;
  }, {});
  if (includeConfiguration) {
    result.configuration = {
      ...model.configuration.attributes
    };
  }
  return result;
}
function getItem(state, collectionName, key) {
  if (state[collectionName]) {
    return state[collectionName].items[key];
  }
}
function createMultipleItemsSelector(collectionNames, filter) {
  return createSelector(...collectionNames.map(collectionName => collections => collections[collectionName]), (...collections) => {
    return collectionNames.reduce((result, collectionName, index) => {
      result[collectionName] = toOrderedItems(collections[index]);
      return result;
    }, {});
  });
}
function createItemsSelector(collectionName, filter) {
  if (filter) {
    const itemsSelector = createItemsSelector(collectionName);
    return createShallowEqualArraysSelector(collections => itemsSelector(collections).filter(filter), items => items);
  }
  return createSelector(collections => collections[collectionName], toOrderedItems);
}
function toOrderedItems(collection) {
  if (collection) {
    const items = collection.items;
    return collection.order.map(key => items[key]);
  } else {
    return [];
  }
}
const createShallowEqualArraysSelector = createSelectorCreator(defaultMemoize, shallowEqualArrays);
function shallowEqualArrays(a, b) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

const Context = createContext();
function EntryStateProvider({
  seed,
  children
}) {
  const [collections, dispatch] = useCollections(seed.collections, {
    keyAttribute: 'permaId'
  });
  const value = useMemo(() => ({
    entryState: {
      collections,
      config: seed.config
    },
    dispatch
  }), [collections, dispatch, seed]);
  return /*#__PURE__*/React.createElement(Context.Provider, {
    value: value
  }, children);
}
function useEntryState(selector = entryState => entryState) {
  return useContextSelector(Context, value => selector(value.entryState));
}
function useEntryStateDispatch() {
  return useContextSelector(Context, value => value.dispatch);
}
function useEntryStateConfig() {
  return useEntryState(entryState => entryState.config);
}
function useEntryStateCollectionItem(collectionName, key) {
  return useEntryState(entryState => getItem(entryState.collections, collectionName, key));
}
function useEntryStateCollectionItems(collectionName, filter) {
  const itemsSelector = useMemo(() => createItemsSelector(collectionName, filter), [collectionName, filter]);
  return useEntryState(entryState => itemsSelector(entryState.collections));
}
function useMultipleEntryStateCollectionItems(collectionNames) {
  const multipleItemsSelector = useMemo(() => createMultipleItemsSelector(collectionNames), [collectionNames]);
  return useEntryState(entryState => multipleItemsSelector(entryState.collections));
}

/**
 * Returns data generated by a Ruby lambda registered server
 * side via `config.additional_frontend_seed_data.register`.
 *
 * @example
 *
 * const data = useAdditionalSeedData('someSeed');
 */
function useAdditionalSeedData(name) {
  const config = useEntryStateConfig();
  if (!config.additionalSeedData[name]) {
    throw new Error(`Could not find additional seed data with name '${name}'.`);
  }
  return config.additionalSeedData[name];
}

function useContentElementConsentVendor({
  contentElementId
}) {
  const config = useEntryStateConfig();
  const vendorName = config.contentElementConsentVendors[contentElementId];
  return config.consentVendors.find(vendor => vendor.name === vendorName);
}

function useCutOff() {
  const config = useEntryStateConfig();
  return config.cutOff;
}

function useEmbedOriginUrl() {
  const config = useEntryStateConfig();
  return config.embed ? config.originUrl : undefined;
}

/**
 * Returns an object containing theme asset paths.
 *
 * @example
 *
 * const theme = useTheme();
 * theme // =>
 *   {
 *     assets: {
 *       logoDesktop: 'path/to/logoDesktop.svg',
 *       logoMobile: 'path/to/logoMobile.svg'
 *     },
 *     options: {
 *       // options passed to `themes.register` in `pageflow.rb` initializer
 *       // with camleized keys.
 *     }
 *   }
 */
function useTheme() {
  const config = useEntryStateConfig();
  return config.theme;
}

/**
 * Returns a nested data structure representing the metadata of the entry.
 *
 * @example
 *
 * const metaData = useEntryMetadata();
 * metaData // =>
 *   {
 *     id: 5,
 *     locale: 'en',
 *     shareProviders: {email: false, facebook: true},
 *     share_url: 'http://test.host/test',
 *     credits: 'Credits: Pageflow',
 *     configuration: {darkWidgets: true}
 *   }
 */
function useEntryMetadata() {
  const entries = useEntryStateCollectionItems('entries');
  return useMemo(() => {
    return entries[0];
  }, [entries]);
}

/**
 * Returns boolean indicating whether dark variant has been activated for
 * the widgets of the entry.
 */
function useDarkWidgets() {
  const theme = useTheme();
  return useEntryMetadata().configuration.darkWidgets || theme.options.darkWidgets;
}

/**
 * Returns a list of attributes (iconName, name and url) of all configured share
 * providers of the entry. The url provides a %<url>s placeholder where the link
 * can be inserted. iconName can be passed to ThemeIcon to render a theme
 * specific icon.
 *
 * @example
 *
 * const shareProviders = useShareProviders(options);
 * shareProviders // =>
 *   [
 *     {
 *       iconName: 'facebook',
 *       name: 'Facebook',
 *       url: http://www.facebook.com/sharer/sharer.php?u=%<url>s
 *     },
 *     {
 *       iconName: 'twitter',
 *       name: 'Twitter',
 *       url: https://x.com/intent/post?url=%<url>s
 *     }
 *   ]
 */
function useShareProviders({
  isPhonePlatform
}) {
  const config = useEntryStateConfig();
  const entryMetadata = useEntryMetadata();
  const shareProviders = (entryMetadata === null || entryMetadata === void 0 ? void 0 : entryMetadata.shareProviders) || {};
  const urlTemplates = config.shareUrlTemplates;
  return useMemo(() => {
    const sharing = {
      bluesky: {
        iconName: 'bluesky',
        name: 'Bluesky',
        url: urlTemplates.bluesky
      },
      email: {
        iconName: 'email',
        name: 'Mail',
        url: urlTemplates.email
      },
      facebook: {
        iconName: 'facebook',
        name: 'Facebook',
        url: urlTemplates.facebook
      },
      linked_in: {
        iconName: 'linkedIn',
        name: 'LinkedIn',
        url: urlTemplates.linked_in
      },
      telegram: {
        iconName: 'telegram',
        name: 'Telegram',
        url: urlTemplates.telegram
      },
      threads: {
        iconName: 'threads',
        name: 'threads',
        url: urlTemplates.threads
      },
      twitter: {
        iconName: 'twitter',
        name: 'X',
        url: urlTemplates.twitter
      },
      whats_app: {
        iconName: 'whatsApp',
        name: 'WhatsApp',
        url: urlTemplates.whats_app
      }
    };
    return activeShareProviders(shareProviders, isPhonePlatform).map(provider => {
      const config = sharing[provider];
      return {
        name: config.name,
        iconName: config.iconName,
        url: config.url
      };
    });
  }, [shareProviders, isPhonePlatform, urlTemplates]);
}
function activeShareProviders(shareProvidersConfig, isPhonePlatform) {
  const providers = filterShareProviders(shareProvidersConfig, isPhonePlatform);
  return providers.filter(function (provider) {
    return shareProvidersConfig[provider] !== false;
  });
}
function filterShareProviders(shareProvidersConfig, isPhonePlatform) {
  if (!isPhonePlatform) {
    return Object.keys(shareProvidersConfig).filter(function (provider) {
      return provider !== 'telegram' && provider !== 'whats_app';
    });
  }
  return Object.keys(shareProvidersConfig);
}

/**
 * Returns the share url of the entry.
 *
 * @example
 *
 * const shareUrl = useShareUrl();
 * shareUrl // => "http://test.host/test"
 */
function useShareUrl() {
  const entryMetadata = useEntryMetadata();
  const config = useEntryStateConfig();
  if (entryMetadata) {
    return entryMetadata.shareUrl ? entryMetadata.shareUrl : config.prettyUrl;
  } else {
    return config.shareUrl;
  }
}

function useEntryTranslations() {
  const config = useEntryStateConfig();
  return config.entryTranslations;
}

function getChapterSlugs(chapters) {
  const result = {};
  const usedSlugs = {};
  chapters.forEach(chapter => {
    let chapterSlug = chapter.configuration.title;
    if (chapterSlug) {
      chapterSlug = slugify(chapterSlug, {
        lower: true,
        locale: 'de',
        strict: true
      });
      if (usedSlugs[chapterSlug]) {
        chapterSlug = chapterSlug + '-' + chapter.permaId;
      }
      usedSlugs[chapterSlug] = true;
    } else {
      chapterSlug = 'chapter-' + chapter.permaId;
    }
    result[chapter.permaId] = chapterSlug;
  });
  return result;
}

/**
 * Returns a nested data structure representing the chapters and sections
 * of the entry.
 *
 * @private
 *
 * @example
 *
 * const structure = useEntryStructure();
 * structure // =>
 *   {
 *     main: [
 *       {
 *         permaId: 5,
 *         title: 'Chapter 1',
 *         summary: 'An introductory chapter',
 *         sections: [
 *           {
 *             id: 1,
 *             permaId: 101,
 *             chapterId: 3,
 *             sectionIndex: 0,
 *             transition: 'scroll',
 *
 *             // references to parent chapter
 *             chapter: { ... },
 *
 *             // references to adjacent section objects
 *             previousSection: { ... },
 *             nextSection: { ... },
 *           }
 *         ],
 *       }
 *     ],
 *     excursions: [ ... ],
 *     mainSectionsCount: 2
 *   }
 */
function useEntryStructure() {
  const mainStoryline = useMainStoryline();
  const chapters = useChapters();
  const sections = useEntryStateCollectionItems('sections');
  return useMemo(() => buildEntryStructure({
    mainStoryline,
    chapters,
    sections
  }), [mainStoryline, chapters, sections]);
}

/**
 * Like {@link useEntryStructure}, but additionally nests an ordered
 * `contentElements` array (including backdrop elements) into each
 * section. Kept separate so the more frequently used
 * `useEntryStructure` does not re-derive when content elements change.
 *
 * @private
 */
function useEntryStructureWithContentElements() {
  const mainStoryline = useMainStoryline();
  const chapters = useChapters();
  const sections = useEntryStateCollectionItems('sections');
  const contentElements = useEntryStateCollectionItems('contentElements');
  return useMemo(() => {
    const contentElementsBySectionId = {};
    contentElements.forEach(contentElement => {
      const sectionContentElements = contentElementsBySectionId[contentElement.sectionId] || (contentElementsBySectionId[contentElement.sectionId] = []);
      sectionContentElements.push(contentElementSubjectData(contentElement));
    });
    return buildEntryStructure({
      mainStoryline,
      chapters,
      sections,
      contentElementsBySectionId
    });
  }, [mainStoryline, chapters, sections, contentElements]);
}
function buildEntryStructure({
  mainStoryline,
  chapters,
  sections,
  contentElementsBySectionId
}) {
  const enrichedSections = sections.map(section => ({
    ...sectionData(section),
    ...(contentElementsBySectionId && {
      contentElements: contentElementsBySectionId[section.id] || []
    })
  }));
  const main = [];
  const excursions = [];
  chapters.forEach(chapter => {
    const chapterSections = enrichedSections.filter(item => item.chapterId === chapter.id);
    const isExcursion = chapter.storylineId !== mainStoryline.id;
    chapter = {
      ...chapter,
      isExcursion,
      sections: chapterSections
    };
    chapterSections.forEach(section => section.chapter = chapter);
    if (isExcursion) {
      excursions.push(chapter);
    } else {
      main.push(chapter);
    }
  });
  const mainSections = main.flatMap(chapter => chapter.sections);
  linkAndIndexSections(mainSections);
  excursions.forEach(excursion => linkAndIndexSections(excursion.sections));
  return {
    main,
    excursions,
    mainSectionsCount: mainSections.length
  };
}
function contentElementSubjectData(contentElement) {
  return {
    id: contentElement.id,
    permaId: contentElement.permaId,
    sectionId: contentElement.sectionId,
    type: contentElement.typeName
  };
}
function linkAndIndexSections(sections) {
  sections.forEach((section, index) => {
    section.sectionIndex = index;
    section.previousSection = sections[index - 1];
    section.nextSection = sections[index + 1];
  });
}

/**
 * Returns an array of sections each with a chapter property containing
 * data about the parent chapter.
 *
 * @private
 *
 * @example
 *
 * const sections = useSectionsWithChapter();
 * sections // =>
 *   [
 *     {
 *       id: 1,
 *       permaId: 101,
 *       chapterId: 3,
 *       transition: 'scroll',
 *       chapter: {
 *         id: 3,
 *         permaId: 5,
 *         title: 'Chapter 1',
 *         summary: 'An introductory chapter',
 *         chapterSlug: 'chapter-1'
 *       },
 *     }
 *   ]
 */
function useSectionsWithChapter() {
  const chapters = useChapters();
  const sections = useEntryStateCollectionItems('sections');
  const chaptersById = useMemo(() => chapters.reduce((result, chapter) => {
    result[chapter.id] = chapter;
    return result;
  }, {}), [chapters]);
  return useMemo(() => {
    return sections.map((section, sectionIndex) => ({
      sectionIndex,
      ...sectionData(section),
      chapter: chaptersById[section.chapterId]
    }));
  }, [chaptersById, sections]);
}

/**
 * Returns a nested data structure representing the content elements
 * of section.
 *
 * @param {Object} options
 * @param {number} options.sectionPermaId
 *
 * @private
 *
 * @example
 *
 * const section = useSection({sectionPermaId: 4});
 * section // =>
 *   {
 *     id: 100,
 *     permaId: 4,
 *     chapterId: 1,
 *     transition: 'scroll'
 *   }
 */
function useSection({
  sectionPermaId
}) {
  const section = useEntryStateCollectionItem('sections', sectionPermaId);
  return sectionData(section);
}
function sectionData(section) {
  return section && {
    permaId: section.permaId,
    id: section.id,
    chapterId: section.chapterId,
    ...normalizeSectionConfigurationData(section.configuration)
  };
}
function normalizeSectionConfigurationData(configuration) {
  return {
    ...configuration,
    ...(configuration.backdropType === 'contentElement' ? {
      fullHeight: true
    } : {})
  };
}
function useSectionForegroundContentElements({
  sectionId,
  layout,
  phoneLayout
}) {
  const filter = useCallback(contentElement => contentElement.sectionId === sectionId && contentElement.configuration.position !== 'backdrop', [sectionId]);
  const contentElements = useEntryStateCollectionItems('contentElements', filter);
  return contentElements.map(contentElement => contentElementData(contentElement, layout, phoneLayout));
}
function useContentElement({
  permaId,
  layout
}) {
  const contentElement = useEntryStateCollectionItem('contentElements', permaId);
  return useMemo(() => contentElement && contentElementData(contentElement, layout), [contentElement, layout]);
}

/**
 * Returns the perma id of the section a comment subject lives in: the
 * subject's perma id itself for a section subject, the parent section's
 * perma id for a content element subject. Persisted with new threads so
 * they stay grouped under their section once the subject is deleted.
 *
 * @private
 */
function useSectionPermaIdOfSubject({
  subjectType,
  subjectId
}) {
  const contentElement = useEntryStateCollectionItem('contentElements', subjectId);
  const sections = useEntryStateCollectionItems('sections');
  return useMemo(() => {
    var _sections$find;
    switch (subjectType) {
      case 'Section':
        return subjectId;
      case 'ContentElement':
        return (_sections$find = sections.find(section => section.id === (contentElement === null || contentElement === void 0 ? void 0 : contentElement.sectionId))) === null || _sections$find === void 0 ? void 0 : _sections$find.permaId;
      default:
        return undefined;
    }
  }, [subjectType, subjectId, contentElement, sections]);
}
function contentElementData(contentElement, layout, phoneLayout) {
  const position = getPosition(contentElement, layout, phoneLayout);
  return {
    id: contentElement.id,
    permaId: contentElement.permaId,
    sectionId: contentElement.sectionId,
    type: contentElement.typeName,
    position,
    width: getWidth(contentElement, position, phoneLayout),
    standAlone: contentElement.configuration.position === 'standAlone',
    alignment: contentElement.configuration.alignment,
    props: contentElement.configuration
  };
}
const supportedPositions = {
  center: ['inline', 'left', 'right'],
  centerRagged: ['inline', 'left', 'right'],
  left: ['inline', 'side', 'sticky'],
  right: ['inline', 'side', 'sticky'],
  backdrop: ['backdrop']
};
function getPosition(contentElement, layout, phoneLayout) {
  const position = contentElement.configuration.position;
  if (contentElement.configuration.fullWidthInPhoneLayout && phoneLayout) {
    return 'inline';
  }
  return supportedPositions[layout || 'left'].includes(position) ? position : 'inline';
}
const legacyPositionWidths = {
  wide: 2,
  full: 3
};
const clampedWidthPositions = ['sticky', 'left', 'right'];
function getWidth(contentElement, position, phoneLayout) {
  const width = typeof contentElement.configuration.width === 'number' ? contentElement.configuration.width : legacyPositionWidths[contentElement.configuration.position] || 0;
  if (contentElement.configuration.fullWidthInPhoneLayout && phoneLayout) {
    return 3;
  } else if (clampedWidthPositions.includes(position)) {
    return Math.min(Math.max(width || 0, -2), 2);
  } else {
    return width;
  }
}
function useChapter({
  permaId
}) {
  const chapters = useChapters();
  return useMemo(() => chapters.find(chapter => chapter.permaId === permaId), [chapters, permaId]);
}
function useChapters() {
  const chapters = useEntryStateCollectionItems('chapters');
  return useMemo(() => {
    const chapterSlugs = getChapterSlugs(chapters);
    return chapters.map((chapter, index) => ({
      id: chapter.id,
      permaId: chapter.permaId,
      storylineId: chapter.storylineId,
      chapterSlug: chapterSlugs[chapter.permaId],
      index,
      ...chapter.configuration
    }));
  }, [chapters]);
}
function useMainChapters() {
  const chapters = useChapters();
  const mainStoryline = useMainStoryline();
  return useMemo(() => chapters.filter(chapter => chapter.storylineId === mainStoryline.id), [chapters, mainStoryline]);
}
function useMainStoryline() {
  const storylines = useEntryStateCollectionItems('storylines');
  return useMemo(() => storylines.find(storyline => storyline.configuration.main), [storylines]);
}

function extendFile(collectionName, file, config) {
  if (!file) {
    return null;
  }
  const variants = file.variants ? ['original', ...file.variants] : Object.keys(config.fileUrlTemplates[collectionName] || {});
  return {
    ...file,
    modelType: resolveModelType(collectionName, config.fileModelTypes),
    urls: buildUrls(collectionName, file, variants, config.fileUrlTemplates),
    variantWidths: computeVariantWidths(collectionName, file, variants)
  };
}
function resolveModelType(collectionName, modelTypes) {
  if (!modelTypes[collectionName]) {
    throw new Error(`Could not find model type for collection name ${collectionName}`);
  }
  return modelTypes[collectionName];
}
function buildUrls(collectionName, file, variants, urlTemplates) {
  if (!urlTemplates[collectionName]) {
    throw new Error(`No file url templates found for ${collectionName}`);
  }
  return variants.reduce((result, variant) => {
    const url = getFileUrl(collectionName, file, variant, urlTemplates);
    if (url) {
      result[variant] = url;
    }
    return result;
  }, {});
}
function getFileUrl(collectionName, file, quality, urlTemplates) {
  const templates = urlTemplates[collectionName];
  const template = templates[quality];
  if (template) {
    return template.replace(':id_partition', idPartition(file.id)).replace(':basename', file.basename).replace(':extension', file.extension).replace(':processed_extension', file.processedExtension).replace(':pageflow_hls_qualities', () => hlsQualities(file));
  }
}
function idPartition(id) {
  return partition(pad(id, 9));
}
function partition(string, separator) {
  return string.replace(/./g, function (c, i, a) {
    return i && (a.length - i) % 3 === 0 ? '/' + c : c;
  });
}
function pad(string, size) {
  return (Array(size).fill(0).join('') + string).slice(-size);
}
function hlsQualities(file) {
  return ['low', 'medium', 'high', 'fullhd', '4k'].filter(quality => file.variants.includes(quality)).join(',');
}
const variantGeometries = {
  imageFiles: {
    medium: 1024,
    large: 1920,
    ultra: 3840
  }
};
function computeVariantWidths(collectionName, file, variants) {
  const geometries = variantGeometries[collectionName];
  if (!geometries) {
    return undefined;
  }
  const widthToVariant = {};
  variants.forEach(variant => {
    const geometrySize = geometries[variant];
    if (geometrySize) {
      const key = variantWidth(file, geometrySize) + 'w';
      if (!widthToVariant[key]) {
        widthToVariant[key] = variant;
      }
    }
  });
  return Object.entries(widthToVariant);
}
function variantWidth(file, geometrySize) {
  const {
    width,
    height
  } = file;
  if (!width || !height) {
    return geometrySize;
  }
  const scale = Math.min(geometrySize / width, geometrySize / height, 1);
  return Math.round(width * scale);
}

/**
 * Look up a file by its collection and perma id.
 *
 * @param {Object} options
 * @param {String} options.collectionName - Collection name of file type to look for (in camel case).
 * @param {String} options.permaId - Perma id of file look up
 *
 * @example
 * const imageFile = useFile({collectionName: 'imageFiles', permaId: 5});
 * imageFile // =>
 *   {
 *     id: 102,
 *     permaId: 5,
 *     width: 1000,
 *     height: 500,
 *     urls: {
 *       large: 'https://...'
 *     },
 *     configuration: {
 *       alt: '...'
 *     }
 *   }
 */
function useFile({
  collectionName,
  permaId
}) {
  const file = useEntryStateCollectionItem(collectionName, permaId);
  const config = useEntryStateConfig();
  return useMemo(() => extendFile(collectionName, file, config), [collectionName, file, config]);
}

function useFileWithInlineRights({
  configuration,
  collectionName,
  propertyName
}) {
  const file = useFile({
    collectionName,
    permaId: configuration[propertyName]
  });
  const config = useEntryStateConfig();
  return file && {
    ...file,
    license: file.configuration.license && config.fileLicenses[file.configuration.license],
    inlineRights: file.configuration.rights_display === 'inline' && !configuration[propertyName === 'id' ? 'inlineRightsHidden' : `${propertyName.replace('Id', '')}InlineRightsHidden`]
  };
}

function useDownloadableFile(options) {
  const file = useFile(options);
  return file && {
    ...file,
    urls: {
      ...file.urls,
      download: `${file.urls.original}?download=${encodeURIComponent(file.displayName)}`
    }
  };
}

function useNestedFiles({
  collectionName,
  parent
}) {
  const config = useEntryStateConfig();
  const files = useEntryStateCollectionItems(collectionName, file => {
    return parent && file.parentFileId === parent.id && file.parentFileModelType === parent.modelType;
  });
  return files.map(file => extendFile(collectionName, file, config));
}

function getFileUrlTemplateHost(seed, collectionName, variant) {
  const hlsUrlTemplate = seed.config.fileUrlTemplates[collectionName][variant];
  return hlsUrlTemplate.split('//')[1].split('/')[0];
}

/**
 * Find the file references a configuration contains.
 *
 * @param {Object} options
 * @param {Array} options.locations - File reference locations of the subject's schema.
 * @param {Object} options.configuration - Configuration to read perma ids from.
 *
 * @private
 */
function collectFileReferences({
  locations,
  configuration
}) {
  return locations.flatMap(location => valuesAt(configuration, location.path).map(({
    path,
    value
  }) => ({
    path,
    permaId: toPermaId(value)
  })).filter(({
    permaId
  }) => permaId).map(({
    path,
    permaId
  }) => ({
    collectionName: location.collection,
    permaId,
    path,
    active: isActive(location.activeIf, configuration)
  })));
}

// Backdrops of legacy sections store a color in the property that
// otherwise holds an image perma id.
function toPermaId(value) {
  const permaId = Number(value);
  return Number.isInteger(permaId) && permaId > 0 ? permaId : null;
}
function valuesAt(value, path, resolvedPath = []) {
  if (value === null || value === undefined) {
    return [];
  }
  if (!path.length) {
    return [{
      path: resolvedPath,
      value
    }];
  }
  const [segment, ...rest] = path;
  if (segment === '*') {
    return Object.entries(value).flatMap(([key, item]) => valuesAt(item, rest, [...resolvedPath, key]));
  }
  return valuesAt(value[segment], rest, [...resolvedPath, segment]);
}
function isActive(activeIf, configuration) {
  if (!activeIf) {
    return true;
  }
  return [activeIf].flat().every(condition => matches(condition, configuration));
}
function matches(condition, configuration) {
  const value = valueAt(configuration, condition.path);
  if ('present' in condition) {
    return (value !== null && value !== undefined) === condition.present;
  }
  if ('not' in condition) {
    return ![condition.not].flat().includes(value);
  }
  return [condition.value].flat().includes(value);
}
function valueAt(configuration, path) {
  return path.reduce((value, segment) => value === null || value === void 0 ? void 0 : value[segment], configuration);
}

/**
 * Find the file references of an entry, indexed by file.
 *
 * @param {Object} options
 * @param {Object} options.collections - Entry state collections.
 * @param {Object} options.locations - File reference locations by subject.
 * @param {Object} options.fileModelTypes - Model type by file collection name.
 *
 * @example
 *
 * const references = collectEntryFileReferences({collections, locations, fileModelTypes});
 * references.of('imageFiles', 5)
 * // => [{subject: {model: 'section', permaId: 12},
 * //      path: ['backdrop', 'image'], active: true}]
 *
 * @private
 */
function collectEntryFileReferences({
  collections,
  locations,
  fileModelTypes
}) {
  const references = {};
  subjects(collections, locations).forEach(subject => collectFileReferences({
    locations: subject.locations,
    configuration: subject.configuration
  }).forEach(reference => add(references, reference, subject.subject)));
  addNestedFileReferences(references, collections, fileModelTypes);
  return {
    of(collectionName, permaId) {
      return references[key({
        collectionName,
        permaId
      })] || [];
    }
  };
}
function subjects({
  entries = [],
  sections = [],
  contentElements = []
}, locations) {
  const bySectionId = groupBySectionId(contentElements);
  return [...entries.map(entry => ({
    subject: {
      model: 'entry'
    },
    configuration: entry,
    locations: locations.entry || []
  })), ...sections.flatMap(section => [{
    subject: {
      model: 'section',
      permaId: section.permaId
    },
    configuration: section.configuration,
    locations: locations.sections || []
  }, ...(bySectionId[section.id] || []).map(contentElement => ({
    subject: {
      model: 'contentElement',
      permaId: contentElement.permaId
    },
    configuration: contentElement.configuration,
    locations: (locations.contentElements || {})[contentElement.typeName] || []
  }))])];
}

// Text tracks and the like are not referenced by any configuration.
function addNestedFileReferences(references, collections, fileModelTypes = {}) {
  const filesById = indexFilesById(collections, fileModelTypes);
  Object.keys(fileModelTypes).forEach(collectionName => (collections[collectionName] || []).forEach(file => {
    var _references$key;
    if (!file.parentFileId) {
      return;
    }
    const parent = filesById[modelTypeAndId(file.parentFileModelType, file.parentFileId)];
    (_references$key = references[key(parent || {})]) === null || _references$key === void 0 ? void 0 : _references$key.forEach(({
      subject,
      path,
      active
    }) => add(references, {
      collectionName,
      permaId: file.permaId,
      path,
      active
    }, subject));
  }));
}
function indexFilesById(collections, fileModelTypes) {
  return Object.entries(fileModelTypes).reduce((result, [collectionName, modelType]) => {
    (collections[collectionName] || []).forEach(file => {
      result[modelTypeAndId(modelType, file.id)] = {
        collectionName,
        permaId: file.permaId
      };
    });
    return result;
  }, {});
}
function add(references, {
  collectionName,
  permaId,
  path,
  active
}, subject) {
  const list = references[key({
    collectionName,
    permaId
  })] = references[key({
    collectionName,
    permaId
  })] || [];
  list.push({
    subject,
    path,
    active
  });
}
function groupBySectionId(contentElements) {
  return contentElements.reduce((result, contentElement) => {
    (result[contentElement.sectionId] = result[contentElement.sectionId] || []).push(contentElement);
    return result;
  }, {});
}
function key({
  collectionName,
  permaId
}) {
  return `${collectionName}/${permaId}`;
}
function modelTypeAndId(modelType, id) {
  return `${modelType}/${id}`;
}

/**
 * Returns the file references of the entry, indexed by file.
 *
 * @example
 *
 * const references = useFileReferences();
 * references.of('imageFiles', 5)
 * // => [{subject: {model: 'section', permaId: 12}, active: true}]
 *
 * @private
 */
function useFileReferences() {
  const config = useEntryStateConfig();
  const entry = useEntryMetadata();
  const sections = useEntryStateCollectionItems('sections');
  const contentElements = useEntryStateCollectionItems('contentElements');
  const collectionNames = useMemo(() => Object.keys(config.fileModelTypes), [config]);
  const files = useMultipleEntryStateCollectionItems(collectionNames);
  return useMemo(() => collectEntryFileReferences({
    collections: {
      entries: [entry],
      sections,
      contentElements,
      ...files
    },
    locations: config.fileReferenceLocations || {},
    fileModelTypes: config.fileModelTypes
  }), [config, entry, sections, contentElements, files]);
}

/**
 * Returns a function telling whether a file is referenced in the entry.
 *
 * Considers every file referenced unless the file_rights_from_references
 * feature is enabled, since schemas do not cover all content element
 * types yet.
 *
 * @example
 *
 * const isFileReferenced = useIsFileReferenced();
 * isFileReferenced('imageFiles', 5) // => true
 *
 * @private
 */
function useIsFileReferenced() {
  const references = useFileReferences();
  return useMemo(() => {
    if (!features.isEnabled('file_rights_from_references')) {
      return () => true;
    }
    return (collectionName, permaId) => references.of(collectionName, permaId).some(({
      active
    }) => active);
  }, [references]);
}

/**
 * Returns a collection of rights and source urls of the files
 * referenced in the entry. If none of the files has a rights attribute
 * configured, it falls back to the default file rights of the
 * entry's site, otherwise returns an empty array.
 *
 * Lists all files of the entry unless the file_rights_from_references
 * feature is enabled, since schemas do not cover all content element
 * types yet.
 *
 * @example
 *
 * const fileRights = useFileRights();
 * fileRights // => [{text: 'author of image 1', urls: ['https://example.com/source-url']}]
 */
function useFileRights() {
  var _config$defaultFileRi;
  const config = useEntryStateConfig();
  const fileCollectionNames = Object.keys(config.fileModelTypes);
  const files = useMultipleEntryStateCollectionItems(fileCollectionNames);
  const isFileReferenced = useIsFileReferenced();
  const defaultFileRights = (_config$defaultFileRi = config.defaultFileRights) === null || _config$defaultFileRi === void 0 ? void 0 : _config$defaultFileRi.trim();
  const items = {};
  Object.keys(files).forEach(collectionName => files[collectionName].filter(file => file.configuration.rights_display !== 'inline').filter(file => isFileReferenced(collectionName, file.permaId)).forEach(file => {
    var _file$rights;
    const text = ((_file$rights = file.rights) === null || _file$rights === void 0 ? void 0 : _file$rights.trim()) || defaultFileRights;
    if (text) {
      var _file$configuration$s;
      items[text] = items[text] || {
        text,
        urls: new Set()
      };
      if ((_file$configuration$s = file.configuration.source_url) === null || _file$configuration$s === void 0 ? void 0 : _file$configuration$s.trim()) {
        items[text].urls.add(file.configuration.source_url);
      }
    }
  }));
  return Object.values(items).map(item => ({
    ...item,
    urls: Array.from(item.urls).sort()
  })).sort((a, b) => a.text.localeCompare(b.text));
}

/**
 * Returns a nested data structure representing the legal info of the entry.
 * Each legal info is separated into label and url to use in links.
 * Both label and url can be blank, depending on the configuration.
 *
 * @example
 *
 * const legalInfo = useLegalInfo();
 * legalInfo // =>
 *   {
 *     imprint: {
 *       label: '',
 *       url: ''
 *     },
 *     copyright: {
 *       label: '',
 *       url: ''
 *     },
 *     privacy: {
 *       label: '',
 *       url: ''
 *     }
 *   }
 */
function useLegalInfo() {
  const config = useEntryStateConfig();
  return config.legalInfo;
}

/**
 * Returns the credits string (rich text) of the entry.
 *
 * @example
 *
 * const credits = useCredits();
 * credits // => "Credits: <a href="http://pageflow.com">pageflow.com</a>"
 */
function useCredits() {
  const entryMetadata = useEntryMetadata();
  let credits = '';
  if (entryMetadata) {
    credits = entryMetadata.credits;
  }
  return credits;
}

const qualities = ['medium', 'fullhd', '4k'];
function useAvailableQualities(file) {
  if (!file) {
    return [];
  }
  return ['auto', ...qualities.filter(name => file.variants.includes(name))];
}

function useWidget({
  role
}) {
  const widgets = useEntryStateCollectionItems('widgets');
  return useMemo(() => widgets.find(widget => widget.role === role && widget.typeName), [role, widgets]);
}
function useActiveWidgets() {
  const widgets = useEntryStateCollectionItems('widgets');
  return useMemo(() => widgets.filter(widget => widget.typeName), [widgets]);
}

/**
 * Entry state collections of an entry, taken from its Backbone models
 * once. Use `watchCollections` instead to keep collections in sync.
 *
 * @private
 */
function collectionsSnapshot(entry) {
  return collectionSpecs(entry).reduce((result, {
    collection,
    name,
    ...spec
  }) => {
    result[name] = collectionSnapshot(collection, spec);
    return result;
  }, {});
}
function watchCollections(entry, {
  dispatch
}) {
  const teardownFns = collectionSpecs(entry).map(({
    collection,
    ...spec
  }) => watchCollection(collection, {
    ...spec,
    dispatch
  }));
  return function () {
    teardownFns.forEach(fn => fn());
  };
}
function collectionSpecs(entry) {
  const {
    storylines,
    chapters,
    sections,
    contentElements,
    widgets,
    files
  } = entry;
  return [{
    collection: new window.Backbone.Collection([entry.metadata]),
    name: 'entries',
    attributes: ['locale', {
      id: () => entry.id
    }, {
      permaId: () => entry.id
    },
    // Make sure key attribute is present
    {
      shareProviders: 'share_providers'
    }, {
      shareUrl: 'share_url'
    }, {
      shareImageId: 'share_image_id'
    }, 'credits'],
    keyAttribute: 'permaId',
    includeConfiguration: true
  }, {
    collection: storylines,
    name: 'storylines',
    attributes: ['id', 'permaId'],
    keyAttribute: 'permaId',
    includeConfiguration: true
  }, {
    collection: chapters,
    name: 'chapters',
    attributes: ['id', 'permaId', 'storylineId'],
    keyAttribute: 'permaId',
    includeConfiguration: true
  }, {
    collection: sections,
    name: 'sections',
    attributes: ['id', 'permaId', 'chapterId'],
    keyAttribute: 'permaId',
    includeConfiguration: true
  }, {
    collection: contentElements,
    name: 'contentElements',
    attributes: ['id', 'permaId', 'typeName', 'sectionId'],
    keyAttribute: 'permaId',
    includeConfiguration: true
  }, {
    // Only sync widgets whose frontend packs the server loads in the editor.
    // Editor-disabled widgets have no registered widget type here, so rendering
    // them in the preview would fail.
    collection: widgets.withWidgetType({
      insertPoint: 'react',
      enabledInEditor: true
    }),
    name: 'widgets',
    attributes: [{
      typeName: 'type_name'
    }, 'role', {
      permaId: 'role'
    }],
    keyAttribute: 'permaId',
    includeConfiguration: true
  }, ...Object.keys(files).map(collectionName => ({
    collection: files[collectionName],
    name: camelize(collectionName),
    attributes: ['id', {
      permaId: 'perma_id'
    }, 'width', 'height', 'basename', 'extension', 'rights', {
      displayName: ['display_name', 'file_name', (displayName, fileName) => displayName || fileName]
    }, {
      processedExtension: 'processed_extension'
    }, {
      isReady: 'is_ready'
    }, {
      variants: variants => variants && variants.map(variant => camelize(variant))
    }, {
      durationInMs: 'duration_in_ms'
    }, {
      parentFileId: 'parent_file_id'
    }, {
      parentFileModelType: 'parent_file_model_type'
    }],
    keyAttribute: 'permaId',
    includeConfiguration: true
  }))];
}
function camelize(snakeCase) {
  return snakeCase.replace(/_[a-z]/g, function (match) {
    return match[1].toUpperCase();
  });
}

function updateContentElementConfiguration({
  dispatch,
  permaId,
  configuration
}) {
  updateConfiguration({
    dispatch,
    name: 'contentElements',
    key: permaId,
    configuration
  });
}

function updateWidgetConfiguration({
  dispatch,
  role,
  configuration
}) {
  updateConfiguration({
    dispatch,
    name: 'widgets',
    key: role,
    configuration
  });
}

export { EntryStateProvider, collectionsSnapshot, getFileUrlTemplateHost, normalizeSectionConfigurationData, updateContentElementConfiguration, updateWidgetConfiguration, useActiveWidgets, useAdditionalSeedData, useAvailableQualities, useChapter, useChapters, useContentElement, useContentElementConsentVendor, useCredits, useCutOff, useDarkWidgets, useDownloadableFile, useEmbedOriginUrl, useEntryMetadata, useEntryStateDispatch, useEntryStructure, useEntryStructureWithContentElements, useEntryTranslations, useFile, useFileReferences, useFileRights, useFileWithInlineRights, useIsFileReferenced, useLegalInfo, useMainChapters, useMainStoryline, useNestedFiles, useSection, useSectionForegroundContentElements, useSectionPermaIdOfSubject, useSectionsWithChapter, useShareProviders, useShareUrl, useTheme, useWidget, watchCollections };
