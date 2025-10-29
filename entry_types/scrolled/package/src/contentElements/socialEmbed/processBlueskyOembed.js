export function processBlueskyOembed(oembedResponse) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(oembedResponse.html, 'text/html');
  var blockquote = doc.querySelector('blockquote.bluesky-embed');

  if (blockquote) {
    var dataUri = blockquote.getAttribute('data-bluesky-uri');
    if (dataUri) {
      return dataUri;
    }
  }

  // Fallback to original URL if extraction fails
  return oembedResponse.url;
}
