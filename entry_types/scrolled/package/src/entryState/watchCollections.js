import {watchCollection} from '../collections';

export function watchCollections({chapters, sections, contentElements, files}, {dispatch}) {
  watchCollection(chapters, {
    name: 'chapters',
    attributes: ['id', 'permaId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  });
  watchCollection(sections, {
    name: 'sections',
    attributes: ['id', 'permaId', 'chapterId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  });
  watchCollection(contentElements, {
    name: 'contentElements',
    attributes: ['id', 'permaId', 'typeName', 'sectionId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch
  });

  Object.keys(files).forEach(collectionName => {
    watchCollection(files[collectionName], {
      name: camelize(collectionName),
      attributes: ['id', {permaId: 'perma_id'}, 'width', 'height', 'basename'],
      keyAttribute: 'permaId',
      includeConfiguration: true,
      dispatch
    });
  });
}

function camelize(snakeCase) {
  return snakeCase.replace(/_[a-z]/g, function(match) {
    return match[1].toUpperCase();
  });
}
