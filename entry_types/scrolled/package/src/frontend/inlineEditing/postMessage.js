export function postInsertContentElementMessage({id, position, at}) {
  window.parent.postMessage(
    {
      type: 'INSERT_CONTENT_ELEMENT',
      payload: {id, position, at}
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
