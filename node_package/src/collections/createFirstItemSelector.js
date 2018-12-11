export default function createFirstItemSelector(collectionName, {namespace} = {}) {
  return function(state) {
    if (namespace) {
      if (!state[namespace]) {
        throw new Error(`Cannot select from unknown namespace ${namespace}.`);
      }

      state = state[namespace];
    }

    const collection = state[collectionName];
    return collection.items[collection.order[0]];
  };
}
