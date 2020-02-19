import {useReducer} from 'react';

const PREFIX = 'PAGEFLOW_SCROLLED_COLLECTION';
const RESET = `${PREFIX}_RESET`;
const ADD = `${PREFIX}_ADD`;
const CHANGE = `${PREFIX}_CHANGE`;
const REMOVE = `${PREFIX}_REMOVE`;
const SORT = `${PREFIX}_SORT`;

export function useCollections(seed = {}, {keyAttribute} = {}) {
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
    }
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
    }
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
    }
  case SORT:
    return {
      ...state,
      [collectionName]: {
        order: action.payload.order,
        items: state[collectionName].items
      }
    }
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

export function watchCollection(collection,
                                {name, dispatch, attributes, includeConfiguration, keyAttribute = 'id'}) {
  const handle = {};
  const options = {
    attributeNames: attributes,
    includeConfiguration
  };
  let tearingDown = false;

  const watchedAttributeNames = getWatchedAttributeNames(attributes);

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
          order: collection.pluck(keyAttribute),
          attributes: getAttributes(model, options)
        }
      });
    }
  }, handle);

  collection.on('change', model => {
    if (hasChangedAttributes(model, watchedAttributeNames)) {
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
    collection.on('change:configuration', model => dispatch({
      type: CHANGE,
      payload: {
        collectionName: name,
        keyAttribute: keyAttribute,
        attributes: getAttributes(model, options)
      }
    }), handle);
  }

  collection.on('remove', model => {
    if (!tearingDown) {
      dispatch({
        type: REMOVE,
        payload: {
          collectionName: name,
          order: collection.pluck(keyAttribute),
          key: model.attributes[keyAttribute]
        }
      })
    }
  }, handle);

  collection.on('sort', model => dispatch({
    type: SORT,
    payload: {
      collectionName: name,
      order: collection
        .pluck(keyAttribute)
        .filter(Boolean)
    }
  }), handle);

  return function() {
    tearingDown = true;
    collection.off(null, null, handle);
  };
}

function hasChangedAttributes(model, attributeNames) {
  return attributeNames.some(attributeName => model.hasChanged(attributeName));
}

function getWatchedAttributeNames(attributeNames) {
  return attributeNames.map(attributeName =>
    typeof attributeName == 'object' ? mappedAttributeSource(attributeName) : attributeName
  );
}

function mappedAttributeSource(attributeName) {
  return attributeName[Object.keys(attributeName)[0]];
}

function getAttributes(model, {attributeNames, includeConfiguration}) {
  const result = attributeNames.reduce((result, attributeName) => {
    if (typeof attributeName == 'object') {
      const key = Object.keys(attributeName)[0];
      const value = attributeName[key];

      if (typeof value == 'function') {
        result[key] = value();
      }
      else {
        result[key] = model.get(value);
      }
    }
    else {
      result[attributeName] = model.get(attributeName);
    }

    return result;
  }, {});

  if (includeConfiguration) {
    result.configuration = model.configuration.attributes;
  };

  return result;
}

export function getItems(state, collectionName) {
  if (state[collectionName]) {
    const items = state[collectionName].items;
    return state[collectionName].order.map(key => items[key]);
  }
  else {
    return [];
  }
}

export function getItem(state, collectionName, key) {
  if (state[collectionName]) {
    return state[collectionName].items[key];
  }
}
