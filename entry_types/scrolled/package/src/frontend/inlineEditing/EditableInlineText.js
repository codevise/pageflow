import React, {memo, useMemo} from 'react';
import {createEditor, Transforms} from 'slate';
import {Slate, Editable, withReact} from 'slate-react';

import {TextPlaceholder} from './TextPlaceholder';
import {useCachedValue} from './useCachedValue';

export const EditableInlineText = memo(function EditableInlineText({
  value, defaultValue = '', placeholder, onChange
}) {
  const editor = useMemo(() => withSingleLine(withReact(createEditor())), []);
  const [cachedValue, setCachedValue] = useCachedValue(value, {
    defaultValue: [{
      type: 'heading',
      children: [{ text: defaultValue }],
    }],
    onDebouncedChange: onChange
  });

  return (
    <>
      <Slate editor={editor} value={cachedValue} onChange={setCachedValue}>
        <Editable/>
      </Slate>
      <TextPlaceholder text={placeholder}
                       visible={!cachedValue[0]?.children[0]?.text} />
    </>
  );
});

function withSingleLine(editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length > 1) {
        Transforms.mergeNodes(editor);
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
}
