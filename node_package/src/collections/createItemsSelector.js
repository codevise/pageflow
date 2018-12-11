export default function(collectionName, {namespace} = {}) {
  return function itemsSelector(state) {
    if (namespace) {
      if (!state[namespace]) {
        throw new Error(`Cannot select from unknown namespace ${namespace}.`);
      }

      state = state[namespace];
    }

    return state[collectionName].items || {};
  };
}
