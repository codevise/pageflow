export function addItemScope(state, collectionName, itemId) {
  return {
    ...state,
    [getItemScopeProperty(collectionName)]: itemId
  };
}

export function getItemScopeProperty(collectionName) {
  return `__${collectionName}_connectedId`;
}
