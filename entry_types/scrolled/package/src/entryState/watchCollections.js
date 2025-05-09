import {watchCollection} from '../collections';

export function watchCollections(entry, {dispatch}) {
  const {storylines, chapters, sections, contentElements, widgets, files} = entry;
  const teardownFns = [];

  teardownFns.push(watchCollection(new Backbone.Collection([entry.metadata]), {
    name: 'entries',
    attributes: [
      'locale',
      {id: () => entry.id},
      {permaId: () => entry.id}, // Make sure key attribute is present
      {shareProviders: 'share_providers'},
      {shareUrl: 'share_url'},
      'credits'
    ],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  }));
  teardownFns.push(watchCollection(storylines, {
    name: 'storylines',
    attributes: ['id', 'permaId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  }));
  teardownFns.push(watchCollection(chapters, {
    name: 'chapters',
    attributes: ['id', 'permaId', 'storylineId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  }));
  teardownFns.push(watchCollection(sections, {
    name: 'sections',
    attributes: ['id', 'permaId', 'chapterId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  }));
  teardownFns.push(watchCollection(contentElements, {
    name: 'contentElements',
    attributes: ['id', 'permaId', 'typeName', 'sectionId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  }));

  teardownFns.push(watchCollection(widgets.withInsertPoint('react'), {
    name: 'widgets',
    attributes: [{typeName: 'type_name'}, 'role', {permaId: 'role'}],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  }));

  Object.keys(files).forEach(collectionName => {
    teardownFns.push(watchCollection(files[collectionName], {
      name: camelize(collectionName),
      attributes: ['id', {permaId: 'perma_id'}, 'width', 'height',
                   'basename', 'extension', 'rights',
                   {processedExtension: 'processed_extension'},
                   {isReady: 'is_ready'},
                   {variants: variants => variants && variants.map(variant => camelize(variant))},
                   {durationInMs: 'duration_in_ms'},
                   {parentFileId: 'parent_file_id'}, {parentFileModelType: 'parent_file_model_type'}],
      keyAttribute: 'permaId',
      includeConfiguration: true,
      dispatch
    }));
  });

  return function() {
    teardownFns.forEach(fn => fn());
  }
}

function camelize(snakeCase) {
  return snakeCase.replace(/_[a-z]/g, function(match) {
    return match[1].toUpperCase();
  });
}
