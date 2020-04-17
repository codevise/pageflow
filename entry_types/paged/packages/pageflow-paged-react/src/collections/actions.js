export const RESET = 'COLLECTION_RESET';
export const ADD = 'COLLECTION_ADD';
export const CHANGE = 'COLLECTION_CHANGE';
export const REMOVE = 'COLLECTION_REMOVE';
export const ORDER = 'COLLECTION_ORDER';

export function reset({collectionName, items}) {
  return {
    type: RESET,
    meta: {
      collectionName
    },
    payload: {
      collectionName,
      items
    }
  };
}

export function add({collectionName, attributes, order}) {
  return {
    type: ADD,
    meta: {
      collectionName
    },
    payload: {
      attributes,
      order
    }
  };
}

export function change({collectionName, attributes}) {
  return {
    type: CHANGE,
    meta: {
      collectionName
    },
    payload: {
      attributes
    }
  };
}

export function remove({collectionName, attributes, order}) {
  return {
    type: REMOVE,
    meta: {
      collectionName
    },
    payload: {
      attributes,
      order
    }
  };
}

export function order({collectionName, order}) {
  return {
    type: ORDER,
    meta: {
      collectionName
    },
    payload: {
      order
    }
  };
}
