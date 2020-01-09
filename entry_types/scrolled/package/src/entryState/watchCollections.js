import {watchCollection} from '../collections';

export function watchCollections({chapters, sections, contentElements}, {dispatch}) {
  watchCollection(chapters, {
    name: 'chapters',
    attributes: ['id', 'permaId'],
    includeConfiguration: true,
    dispatch
  });
  watchCollection(sections, {
    name: 'sections',
    attributes: ['id', 'permaId', 'chapterId'],
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
}
