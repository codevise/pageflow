import {RESET, ADD, CHANGE, REMOVE, add} from './actions';
import attributesItemReducer from './attributesItemReducer';

export default function(collectionName,
                        {
                          idAttribute = 'id',
                          itemReducer = attributesItemReducer
                        } = {}) {
  return function(state = {}, action) {
    let clone, id;

    if (!action.meta || action.meta.collectionName != collectionName) {
      return state;
    }

    switch (action.type) {
    case RESET:
      return action.payload.items.reduce((result, item) => {
        result[item[idAttribute]] = itemReducer(undefined, add({
          collectioName: action.payload.collectioName,
          attributes: item
        }));

        return result;
      }, {});

    case ADD:
      return {
        ...state,
        [action.payload.attributes[idAttribute]]: itemReducer(undefined, action)
      };

    case CHANGE:
      id = action.payload.attributes[idAttribute];

      return {
        ...state,
        [id]: itemReducer(state[id], action)
      };

    case REMOVE:
      id = action.payload.attributes[idAttribute];

      clone = {...state};
      delete clone[id];
      return clone;

    default:
      if (action.meta.itemId) {
        const item = state[action.meta.itemId];
        const reducedItem = itemReducer(item, action);

        if (reducedItem !== item) {
          return {
            ...state,
            [action.meta.itemId]: reducedItem
          };
        }
      }

      return state;
    }
  };
}
