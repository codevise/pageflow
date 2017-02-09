export default function(collectionName) {
  return function itemsSelector(state) {
    return state[collectionName] || {};
  };
}
