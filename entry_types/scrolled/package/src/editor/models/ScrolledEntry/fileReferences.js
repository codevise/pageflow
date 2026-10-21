import {collectFileReferences} from '../../../shared/collectFileReferences';

export function watchFileReferences(entry) {
  const {config} = entry.scrolledSeed;
  const locations = config.fileReferenceLocations || {};
  const referencesBySubject = new Map();
  let referencesByFile = {};
  let updateScheduled = false;

  subjectSources(entry, locations).forEach(source => {
    source.models().forEach(model => scan(source, model));

    entry.listenTo(source.emitter, source.changeEvents, model => {
      scan(source, model);
      update();
    });

    if (source.collection) {
      entry.listenTo(source.collection, 'add', model => {
        scan(source, model);
        scheduleUpdate();
      });

      entry.listenTo(source.collection, 'remove', model => {
        referencesBySubject.delete(model);
        scheduleUpdate();
      });
    }
  });

  Object.values(entry.files).forEach(collection =>
    entry.listenTo(collection,
                   'add remove change:perma_id change:parent_file_id change:parent_file_model_type',
                   scheduleUpdate)
  );

  update();

  return {
    placesFor(file) {
      return (referencesByFile[fileKey(camelize(file.fileType().collectionName),
                                       file.get('perma_id'))] || [])
        .filter(({active}) => active)
        .map(({placeModel, path}) => placeModel.getConfigurationPlace(path));
    }
  };

  function scan(source, model) {
    referencesBySubject.set(model, collectFileReferences({
      locations: source.locations(model),
      configuration: source.configuration(model)
    }).map(reference => ({...reference, placeModel: source.placeModel(model)})));
  }

  function scheduleUpdate() {
    if (updateScheduled) {
      return;
    }

    updateScheduled = true;

    Promise.resolve().then(() => {
      updateScheduled = false;
      update();
    });
  }

  function update() {
    referencesByFile = {};

    referencesBySubject.forEach(references =>
      references.forEach(reference => add(reference))
    );

    addNestedFileReferences();
    markReferencedFiles();
  }

  function add({collectionName, permaId, ...reference}) {
    const key = fileKey(collectionName, permaId);
    (referencesByFile[key] = referencesByFile[key] || []).push(reference);
  }

  function addNestedFileReferences() {
    const modelTypes = config.fileModelTypes || {};
    const parentKeysByModelTypeAndId = {};

    eachFile((file, collectionName) => {
      parentKeysByModelTypeAndId[`${modelTypes[collectionName]}/${file.id}`] =
        fileKey(collectionName, file.get('perma_id'));
    });

    eachFile((file, collectionName) => {
      if (!file.get('parent_file_id')) {
        return;
      }

      const parentKey = parentKeysByModelTypeAndId[
        `${file.get('parent_file_model_type')}/${file.get('parent_file_id')}`
      ];

      (referencesByFile[parentKey] || []).forEach(reference =>
        add({collectionName, permaId: file.get('perma_id'), ...reference})
      );
    });
  }

  function markReferencedFiles() {
    eachFile((file, collectionName) => {
      const references = referencesByFile[fileKey(collectionName, file.get('perma_id'))] || [];
      file.set('is_referenced', references.some(({active}) => active));
    });
  }

  function eachFile(fn) {
    Object.entries(entry.files).forEach(([collectionName, collection]) =>
      collection.each(file => fn(file, camelize(collectionName)))
    );
  }
}

function subjectSources(entry, locations) {
  return [
    {
      emitter: entry.metadata,
      models: () => [entry.metadata],
      changeEvents: 'change:share_image_id',
      locations: () => locations.entry || [],
      configuration: metadata => ({share_image_id: metadata.get('share_image_id')}),
      placeModel: () => entry
    },
    {
      emitter: entry.sections,
      collection: entry.sections,
      models: () => entry.sections.models,
      changeEvents: 'change:configuration',
      locations: () => locations.sections || [],
      configuration: section => section.configuration.attributes,
      placeModel: section => section
    },
    {
      emitter: entry.contentElements,
      collection: entry.contentElements,
      models: () => entry.contentElements.models,
      changeEvents: 'change:configuration',
      locations: contentElement =>
        (locations.contentElements || {})[contentElement.get('typeName')] || [],
      configuration: contentElement => contentElement.configuration.attributes,
      placeModel: contentElement => contentElement
    }
  ];
}

function fileKey(collectionName, permaId) {
  return `${collectionName}/${permaId}`;
}

// File collections are named in snake case in the editor and in camel
// case in entry state.
function camelize(collectionName) {
  return collectionName.replace(/_(.)/g, (match, character) => character.toUpperCase());
}
