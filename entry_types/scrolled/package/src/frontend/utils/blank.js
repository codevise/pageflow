import stripTags from 'striptags';

export function isBlank(html) {
  return !!stripTags(html).match(/^\s*$/);
}

export function presence(html) {
  return isBlank(html) ? null : html;
}

export function isBlankEditableTextValue(value) {
  return !value ||
         value.length === 0 ||
         (value.length === 1 &&
          value[0].children.length <= 1 &&
          !value[0].children[0]?.text);
}
