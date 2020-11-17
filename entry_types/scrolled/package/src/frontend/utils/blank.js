import stripTags from 'striptags';

export function isBlank(html) {
  return !!stripTags(html).match(/^\s*$/);
}

export function presence(html) {
  return isBlank(html) ? null : html;
}
