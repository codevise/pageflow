// True when the cursor's top-level block differs from the highlighted
// thread's start block. Editing in the same block as the highlighted
// thread should keep the highlight in place (so the comment can be
// referenced while editing); only block changes mean the user moved
// past the comment's anchor.
export function cursorLeftHighlightedThreadBlock({editor, commentsSelection, highlights}) {
  if (!commentsSelection?.highlightedThreadId || !highlights) {
    return false;
  }

  const highlightedRange = highlights.find(
    h => h.thread?.id === commentsSelection.highlightedThreadId
  )?.range;

  if (!highlightedRange) return false;

  return editor.selection.anchor.path[0] !== highlightedRange.anchor.path[0];
}
