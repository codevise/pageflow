import {collectionsSnapshot} from 'pageflow-scrolled/entryState';

import {collectEntryFileReferences} from '../../../shared/collectEntryFileReferences';

export function fileReferences(entry) {
  const {config} = entry.scrolledSeed;

  const references = collectEntryFileReferences({
    collections: collectionsSnapshot(entry),
    locations: config.fileReferenceLocations,
    fileModelTypes: config.fileModelTypes
  });

  return {
    placesFor(file) {
      return references.of(camelize(file.fileType().collectionName), file.get('perma_id'))
                       .filter(({active}) => active)
                       .map(({subject, path}) =>
                         subjectModel(entry, subject).getConfigurationPlace(path));
    }
  };
}

function subjectModel(entry, {model, permaId}) {
  if (model === 'entry') {
    return entry;
  }

  if (model === 'section') {
    return entry.sections.findWhere({permaId});
  }

  return entry.contentElements.findWhere({permaId});
}

// File collections are named in snake case in the editor and in camel
// case in entry state.
function camelize(collectionName) {
  return collectionName.replace(/_(.)/g, (match, character) => character.toUpperCase());
}
