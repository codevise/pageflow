export function postInsertContentElementMessage({id, position, at}) {
  window.parent.postMessage(
    {
      type: 'INSERT_CONTENT_ELEMENT',
      payload: {id, position, at}
    },
    window.location.origin
  );
}
