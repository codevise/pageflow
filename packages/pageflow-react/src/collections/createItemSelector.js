import {getItemScopeProperty} from './itemScopeHelpers';

export default function(collectionName, {namespace} = {}) {
  return function({id} = {}) {
    return function(state, props) {
      let modelId = id;
      let namespacedState = state;

      if (namespace) {
        if (!state[namespace]) {
          throw new Error(`Cannot select from unknown namespace ${namespace}.`);
        }

        namespacedState = state[namespace];
      }

      if (!namespacedState[collectionName]) {
        throw new Error(`Cannot select from unknown collection ${collectionName}.`);
      }

      if (typeof id == 'function') {
        modelId = id(state, props);
      }

      modelId = modelId || state[getItemScopeProperty(collectionName)];

      if (!modelId) {
        return null;
      }

      return namespacedState[collectionName].items[modelId];
    };
  };
}
