import {reset, add, change, remove} from './actions';

import pickAttributes from './pickAttributes';

export default function({
  collection, dispatch, collectionName,
  attributes = ['id'],
  includeConfiguration = false
}) {
  dispatch(reset({
    collectionName,
    items: collection.map(modelToAttributes)
  }));

  collection.on('add', (model) => {
    if (!model.isNew()) {
      dispatch(add({
        collectionName,
        attributes: modelToAttributes(model)
      }));
    }
  });

  collection.on('change:id', (model) => {
    dispatch(add({
      collectionName,
      attributes: modelToAttributes(model)
    }));
  });

  collection.on('change', (model) => {
    if (watchedAttributeHasChanged(model)) {
      dispatch(change({
        collectionName,
        attributes: modelToAttributes(model)
      }));
    }
  });

  if (includeConfiguration) {
    collection.on('change:configuration', (model) => {
      dispatch(change({
        collectionName,
        attributes: modelToAttributes(model)
      }));
    });
  }

  collection.on('remove', (model) => {
    setTimeout(() => {
      dispatch(remove({
        collectionName,
        attributes: modelToAttributes(model)
      }));
    }, 0);
  });

  const watchedAttributes = attributes.map(attribute =>
    typeof attribute == 'object' ? mappedAttributeSource(attribute) : attribute
  );

  function watchedAttributeHasChanged(model) {
    return watchedAttributes.some(attribute => model.hasChanged(attribute));
  }

  function modelToAttributes(model) {
    return pickAttributes(attributes,
                          model.attributes,
                          includeConfiguration && model.configuration.attributes);
  }

  function mappedAttributeSource(attribute) {
    return attribute[Object.keys(attribute)[0]];
  }
}
