import {Editor, Element, Transforms} from 'slate';

export function duplicateNodes(editor) {
  if (!editor.selection) {
    return;
  }

  const selectedEntries = Array.from(
    Editor.nodes(editor, {
      at: editor.selection,
      mode: 'highest',
      match: n => Element.isElement(n)
    })
  );

  if (selectedEntries.length === 0) {
    return;
  }

  const clonedNodes = selectedEntries.map(
    ([node]) => JSON.parse(JSON.stringify(node))
  );

  const lastPath = selectedEntries[selectedEntries.length - 1][1];
  const insertAt = lastPath[0] + 1;

  Transforms.insertNodes(editor, clonedNodes, {at: [insertAt]});

  Transforms.select(editor, {
    anchor: Editor.start(editor, [insertAt]),
    focus: Editor.end(editor, [insertAt + clonedNodes.length - 1])
  });
}
