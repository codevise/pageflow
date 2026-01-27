import {ReactEditor} from 'slate-react';

const originalToSlateRange = ReactEditor.toSlateRange;

ReactEditor.toSlateRange = function(editor, domRange) {
  try {
    return originalToSlateRange.apply(this, arguments);
  } catch (e) {
    if (e.message.startsWith('Cannot resolve a Slate point from DOM point') &&
        domRange === window.getSelection() &&
        editor.selection) {
      console.warn('Ignored "Cannot resolve a Slate point from DOM point" - selection outside editor');
      return editor.selection;
    }

    throw e;
  }
}
