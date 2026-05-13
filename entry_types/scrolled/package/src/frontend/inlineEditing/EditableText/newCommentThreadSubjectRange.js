import {Editor, Range} from 'slate';

// Range to seed a new comment thread on the current slate selection.
// When the selection is collapsed (just a cursor), expand to the full
// surrounding top-level block so the new thread anchors to the whole
// paragraph rather than a zero-width point.
export function newCommentThreadSubjectRange(editor) {
  if (!editor.selection) return undefined;

  if (Range.isCollapsed(editor.selection)) {
    const blockIdx = editor.selection.anchor.path[0];
    return {
      anchor: Editor.point(editor, [blockIdx], {edge: 'start'}),
      focus: Editor.point(editor, [blockIdx], {edge: 'end'})
    };
  }

  return editor.selection;
}
