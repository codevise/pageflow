import {RESET, ADD, CHANGE, REMOVE, ORDER, add} from './actions';
import attributesItemReducer from './attributesItemReducer';

export default function(collectionName,
                        {
                          idAttribute = 'id',
                          itemReducer = attributesItemReducer
                        } = {}) {
  const initialState = {
    order: [],
    items: {}
  };

  return function(state = initialState, action) {
    let clone, id;

    if (!action.meta || action.meta.collectionName != collectionName) {
      return state;
    }

    switch (action.type) {
    case RESET:
      return {
        order: action.payload.items.map(item => item[idAttribute]),
        items: action.payload.items.reduce((result, item) => {
          result[item[idAttribute]] = itemReducer(undefined, add({
            collectioName: action.payload.collectioName,
            attributes: item
          }));

          return result;
        }, {})
      };

    case ADD:
      return {
        order: action.payload.order,
        items: {
          ...state.items,
          [action.payload.attributes[idAttribute]]: itemReducer(undefined, action)
        }
      };

    case CHANGE:
      id = action.payload.attributes[idAttribute];

      return {
        order: state.order,
        items: {
          ...state.items,
          [id]: itemReducer(state.items[id], action)
        }
      };

    case REMOVE:
      id = action.payload.attributes[idAttribute];

      clone = {...state.items};
      delete clone[id];
      return {
        order: action.payload.order,
        items: clone
      };

    case ORDER:
      return {
        items: state.items,
        order: action.payload.order
      };

    default:
      if (action.meta.itemId) {
        const item = state.items[action.meta.itemId];
        const reducedItem = itemReducer(item, action);

        if (reducedItem !== item) {
          return {
            order: state.order,
            items: {
              ...state.items,
              [action.meta.itemId]: reducedItem
            }
          };
        }
      }

      return state;
    }
  };
}
