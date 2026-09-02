import {collectFileReferences} from './collectFileReferences';

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
 * // => [{subject: {model: 'section', permaId: 12}, active: true}]
 *
 * @private
 */
export function collectEntryFileReferences({collections, locations, fileModelTypes}) {
  const references = {};

  subjects(collections, locations).forEach(subject =>
    collectFileReferences({
      locations: subject.locations,
      configuration: subject.configuration
    }).forEach(reference => add(references, reference, subject.subject))
  );

  addNestedFileReferences(references, collections, fileModelTypes);

  return {
    of(collectionName, permaId) {
      return references[key({collectionName, permaId})] || [];
    }
  };
}

function subjects({sections = [], contentElements = []}, locations) {
  const bySectionId = groupBySectionId(contentElements);

  return sections.flatMap(section => [
    {
      subject: {model: 'section', permaId: section.permaId},
      configuration: section.configuration,
      locations: locations.sections || []
    },
    ...(bySectionId[section.id] || []).map(contentElement => ({
      subject: {model: 'contentElement', permaId: contentElement.permaId},
      configuration: contentElement.configuration,
      locations: (locations.contentElements || {})[contentElement.typeName] || []
    }))
  ]);
}

// Text tracks and the like are not referenced by any configuration.
function addNestedFileReferences(references, collections, fileModelTypes = {}) {
  const filesById = indexFilesById(collections, fileModelTypes);

  Object.keys(fileModelTypes).forEach(collectionName =>
    (collections[collectionName] || []).forEach(file => {
      if (!file.parentFileId) {
        return;
      }

      const parent = filesById[modelTypeAndId(file.parentFileModelType, file.parentFileId)];

      references[key(parent || {})]?.forEach(({subject, active}) =>
        add(references, {collectionName, permaId: file.permaId, active}, subject)
      );
    })
  );
}

function indexFilesById(collections, fileModelTypes) {
  return Object.entries(fileModelTypes).reduce((result, [collectionName, modelType]) => {
    (collections[collectionName] || []).forEach(file => {
      result[modelTypeAndId(modelType, file.id)] = {collectionName, permaId: file.permaId};
    });

    return result;
  }, {});
}

function add(references, {collectionName, permaId, active}, subject) {
  const list = references[key({collectionName, permaId})] =
    references[key({collectionName, permaId})] || [];

  list.push({subject, active});
}

function groupBySectionId(contentElements) {
  return contentElements.reduce((result, contentElement) => {
    (result[contentElement.sectionId] = result[contentElement.sectionId] || [])
      .push(contentElement);

    return result;
  }, {});
}

function key({collectionName, permaId}) {
  return `${collectionName}/${permaId}`;
}

function modelTypeAndId(modelType, id) {
  return `${modelType}/${id}`;
}
