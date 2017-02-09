export function ensureItemActionId(action, collectionName, itemId) {
  if (action.meta &&
      action.meta.collectionName == collectionName &&
      !action.meta.itemId) {

    action.meta = {
      ...action.meta,
      itemId
    };
  }
}

export function isItemAction(action, collectionName) {
  return action.meta && action.meta.collectionName == collectionName;
}

export function getItemIdFromItemAction(action) {
  return action.meta && action.meta.itemId;
}
