import {collectionSnapshot, watchCollection} from '../collections';

/**
 * Entry state collections of an entry, taken from its Backbone models
 * once. Use `watchCollections` instead to keep collections in sync.
 *
 * @private
 */
export function collectionsSnapshot(entry) {
  return collectionSpecs(entry).reduce((result, {collection, name, ...spec}) => {
    result[name] = collectionSnapshot(collection, spec);
    return result;
  }, {});
}

export function watchCollections(entry, {dispatch}) {
  const teardownFns = collectionSpecs(entry).map(
    ({collection, ...spec}) => watchCollection(collection, {...spec, dispatch})
  );

  return function() {
    teardownFns.forEach(fn => fn());
  }
}

function collectionSpecs(entry) {
  const {storylines, chapters, sections, contentElements, widgets, files} = entry;

  return [
    {
      collection: new window.Backbone.Collection([entry.metadata]),
      name: 'entries',
      attributes: [
        'locale',
        {id: () => entry.id},
        {permaId: () => entry.id}, // Make sure key attribute is present
        {shareProviders: 'share_providers'},
        {shareUrl: 'share_url'},
        {shareImageId: 'share_image_id'},
        'credits'
      ],
      keyAttribute: 'permaId',
      includeConfiguration: true
    },
    {
      collection: storylines,
      name: 'storylines',
      attributes: ['id', 'permaId'],
      keyAttribute: 'permaId',
      includeConfiguration: true
    },
    {
      collection: chapters,
      name: 'chapters',
      attributes: ['id', 'permaId', 'storylineId'],
      keyAttribute: 'permaId',
      includeConfiguration: true
    },
    {
      collection: sections,
      name: 'sections',
      attributes: ['id', 'permaId', 'chapterId'],
      keyAttribute: 'permaId',
      includeConfiguration: true
    },
    {
      collection: contentElements,
      name: 'contentElements',
      attributes: ['id', 'permaId', 'typeName', 'sectionId'],
      keyAttribute: 'permaId',
      includeConfiguration: true
    },
    {
      // Only sync widgets whose frontend packs the server loads in the editor.
      // Editor-disabled widgets have no registered widget type here, so rendering
      // them in the preview would fail.
      collection: widgets.withWidgetType({insertPoint: 'react', enabledInEditor: true}),
      name: 'widgets',
      attributes: [{typeName: 'type_name'}, 'role', {permaId: 'role'}],
      keyAttribute: 'permaId',
      includeConfiguration: true
    },
    ...Object.keys(files).map(collectionName => ({
      collection: files[collectionName],
      name: camelize(collectionName),
      attributes: ['id', {permaId: 'perma_id'}, 'width', 'height',
                   'basename', 'extension', 'rights',
                   {displayName: [
                     'display_name', 'file_name',
                     (displayName, fileName) => displayName || fileName
                   ]},
                   {processedExtension: 'processed_extension'},
                   {isReady: 'is_ready'},
                   {variants: variants => variants && variants.map(variant => camelize(variant))},
                   {durationInMs: 'duration_in_ms'},
                   {parentFileId: 'parent_file_id'},
                   {parentFileModelType: 'parent_file_model_type'}],
      keyAttribute: 'permaId',
      includeConfiguration: true
    }))
  ];
}

function camelize(snakeCase) {
  return snakeCase.replace(/_[a-z]/g, function(match) {
    return match[1].toUpperCase();
  });
}
