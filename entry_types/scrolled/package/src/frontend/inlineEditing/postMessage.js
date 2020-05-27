export function postInsertContentElementMessage({id, at, splitPoint}) {
  window.parent.postMessage(
    {
      type: 'INSERT_CONTENT_ELEMENT',
      payload: {id, at, splitPoint}
    },
    window.location.origin
  );
}

export function postUpdateContentElementMessage({id, configuration}) {
  window.parent.postMessage(
    {
      type: 'UPDATE_CONTENT_ELEMENT',
      payload: {
        id,
        configuration
      }
    },
    window.location.origin
  );
}

export function postUpdateTransientContentElementStateMessage({id, state}) {
  window.parent.postMessage(
    {
      type: 'UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE',
      payload: {
        id,
        state
      }
    },
    window.location.origin
  );
}
