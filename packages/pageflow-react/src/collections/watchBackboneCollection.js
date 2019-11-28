import {reset, add, change, remove, order} from './actions';

import pickAttributes from './pickAttributes';

export default function({
  collection, dispatch, collectionName,
  idAttribute = 'id',
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
      attributes: modelToAttributes(model),
      order: collection.pluck(idAttribute)
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
        attributes: modelToAttributes(model),
        order: collection.pluck(idAttribute)
      }));
    }, 0);
  });

  collection.on('sort', () => {
    dispatch(order({
      collectionName,
      order: collection.pluck(idAttribute)
    }));
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
