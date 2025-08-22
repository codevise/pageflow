export function changeLocationHash(hash) {
  const oldURL = window.location.href;

  window.location.hash = hash;

  window.dispatchEvent(new HashChangeEvent('hashchange', {
    oldURL,
    newURL: window.location.href
  }));
}
