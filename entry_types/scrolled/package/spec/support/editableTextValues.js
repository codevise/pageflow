export function editableTextValue(texts, {type = 'paragraph'} = {}) {
  return [].concat(texts).map(text => ({
    type,
    children: [{text}]
  }));
}
