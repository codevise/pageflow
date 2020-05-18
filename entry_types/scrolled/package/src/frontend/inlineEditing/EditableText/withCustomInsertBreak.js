import {Transforms, Editor, Range} from 'slate';

export function withCustomInsertBreak(editor) {
  const {insertBreak} = editor;

  editor.insertBreak = function() {
    const {selection} = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n)
      });

      if (match) {
        const [block, path] = match;

        if (Editor.isEnd(editor, selection.anchor, path) &&
            block.type === 'heading') {
          Transforms.insertNodes(editor, {
            type: 'paragraph',
            children: [{text: ''}]
          });
          return;
        }
      }
    }

    insertBreak();
  }

  return editor;
}
