import stripTags from 'striptags';

export default function isBlank(html) {
  return !!stripTags(html).match(/^\s*$/);
}
