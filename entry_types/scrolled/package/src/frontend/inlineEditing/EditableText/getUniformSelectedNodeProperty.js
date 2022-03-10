import {Editor} from 'slate';

export function getUniformSelectedNodeProperty(editor, propertyName) {
  const currentNodeEntries = [...Editor.nodes(editor, {
    match: n => !!n.type, mode: 'highest'
  })];

  const values = [...new Set(currentNodeEntries.map(
    ([node, path]) => node[propertyName]
  ))];

  return values.length === 1 ? values[0] : null;
}
