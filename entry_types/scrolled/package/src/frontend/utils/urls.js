export function ensureProtocol(protocol, url) {
  if (url && url.match(/^\/\//)) {
    return `${protocol}:${url}`;
  }

  return url;
}
