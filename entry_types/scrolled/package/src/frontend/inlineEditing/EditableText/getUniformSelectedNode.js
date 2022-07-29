import {Editor} from 'slate';

export function getUniformSelectedNode(editor, propertyName) {
  const currentNodeEntries = [...Editor.nodes(editor, {
    match: n => !!n.type, mode: 'highest'
  })];

  const values = [...new Set(currentNodeEntries.map(
    ([node, path]) => node[propertyName]
  ))];

  return values.length === 1 ? currentNodeEntries[0][0] : null;
}
