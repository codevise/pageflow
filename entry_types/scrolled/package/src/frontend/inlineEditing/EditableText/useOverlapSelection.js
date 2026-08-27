import {Range} from 'slate';
import {ReactEditor, useSlate} from 'slate-react';

// The cursor that comment marks are measured against, so that the badge
// column and the highlight overlay agree on which of them the reviewer
// has selected.
//
// Treats `editor.selection` as a live cursor only while the editor is
// focused. After the user clicks away, slate-react's throttled
// `selectionchange` listener can sync a clamped DOM cursor back into
// `editor.selection`, which would otherwise pass as a selection without
// there being one.
//
// Falls back to the start point of the highlighted thread's range, so
// that its block keeps counting as selected once focus has drifted away
// from the slate editor — following a comment from the sidebar leaves it
// outside. Just the start point, not the full range, to stay consistent
// with rangeOverlapsSelection, which anchors to range starts.
export function useOverlapSelection(highlightedRange) {
  const editor = useSlate();

  const editorSelection = ReactEditor.isFocused(editor) ? editor.selection : null;
  const fallbackPoint = highlightedRange && Range.start(highlightedRange);

  return editorSelection ||
         (fallbackPoint && {anchor: fallbackPoint, focus: fallbackPoint});
}
