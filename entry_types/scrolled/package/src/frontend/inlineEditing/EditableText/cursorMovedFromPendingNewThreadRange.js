import {Range} from 'slate';
import {ReactEditor} from 'slate-react';

// True when the cursor sits at a different range than the pending
// new-thread range AND the editor is focused. The focus guard is
// important: clicking the pending badge itself moves focus to the
// portaled badge button and can drift editor.selection — but that
// drift is not the user moving away from the new thread.
export function cursorMovedFromPendingNewThreadRange({editor, newThreadRange}) {
  if (!ReactEditor.isFocused(editor)) return false;
  return !Range.equals(editor.selection, newThreadRange);
}
