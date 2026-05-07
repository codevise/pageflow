import {useEffect, useState} from 'react';
import {Editor, Range} from 'slate';
import {ReactEditor} from 'slate-react';

export function useEffectiveSelection(editor, onChange) {
  const isDragging = useEditorDragging(editor);

  useEffect(() => {
    const {selection} = editor;

    if (
      isDragging ||
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      onChange(null);
      return;
    }

    onChange(selection);
  }, [editor, editor.selection, isDragging, onChange]);
}

function useEditorDragging(editor) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const editorEl = ReactEditor.toDOMNode(editor, editor);

    function handleMouseDown() {
      setIsDragging(true);

      function handleMouseUp() {
        // Selection sometimes only resets after mouseup has fired
        // when clicking inside an existing selection.
        setTimeout(() => setIsDragging(false), 10);
      }

      document.addEventListener('mouseup', handleMouseUp, {once: true});
    }

    editorEl.addEventListener('mousedown', handleMouseDown);
    return () => editorEl.removeEventListener('mousedown', handleMouseDown);
  }, [editor]);

  return isDragging;
}
