import {getItemScopeProperty} from './itemScopeHelpers';

export default function(collectionName) {
  return function({id, map = (r => r)} = {}) {
    return function(state, props) {
      let modelId = id;

      if (!state[collectionName]) {
        throw new Error(`Cannot select from unknown collection ${collectionName}.`);
      }

      if (typeof id == 'function') {
        modelId = id(state, props);
      }

      modelId = modelId || state[getItemScopeProperty(collectionName)];

      if (!modelId) {
        return null;
      }

      const model = state[collectionName][modelId];

      return model && map(model);
    };
  };
}
