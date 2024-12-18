import {Editor, Transforms} from 'slate';

export const CellTransforms = {
  replaceContent(editor, nodes, {cellPath}) {
    Transforms.insertText(editor, '', {at: cellPath});

    if (nodes.length > 0) {
      Transforms.insertNodes(editor, nodes, {at: [...cellPath, 0]});
    }
  },

  deleteContentUntil(editor, {cellPath, point}) {
    if (!Editor.isStart(editor, point, cellPath)) {
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, cellPath),
          focus: point,
        },
      });
    }
  },

  deleteContentFrom(editor, {cellPath, point}) {
    if (!Editor.isEnd(editor, point, cellPath)) {
      Transforms.delete(editor, {
        at: {
          anchor: point,
          focus: Editor.end(editor, cellPath),
        },
      });
    }
  }
};
