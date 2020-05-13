import React, {useMemo} from 'react';
import {createEditor, Transforms, Node} from 'slate';
import {Slate, Editable, withReact} from 'slate-react';

import {Text} from '../../Text';
import {renderElement, renderLeaf} from '../../EditableText';
import {useCachedValue} from '../useCachedValue';

import {withCustomInsertBreak} from './withCustomInsertBreak';
import {HoveringToolbar} from './HoveringToolbar';
import {Selection} from './Selection';

import styles from './index.module.css';

export const EditableText = React.memo(function EditableText({value, contentElementId, onChange}) {
  const editor = useMemo(() => withCustomInsertBreak(withReact(createEditor())), []);

  const [cachedValue, setCachedValue] = useCachedValue(value, {
    defaultValue: [{
      type: 'paragraph',
      children: [{ text: 'Your Text here...' }],
    }],
    onDebouncedChange: onChange,
    onReset: nextValue => resetSelectionIfOutsideNextValue(editor, nextValue)
  });

  return (
    <Text scaleCategory="body">
      <div className={styles.container}>
        <Slate editor={editor} value={cachedValue} onChange={setCachedValue}>
          <Selection contentElementId={contentElementId} />
          <HoveringToolbar />
          <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf} />
        </Slate>
      </div>
    </Text>
  );
});

function resetSelectionIfOutsideNextValue(editor, nextValue) {
  const nextEditor = {children: nextValue};

  if (editor.selection && (!Node.has(nextEditor, editor.selection.anchor.path) ||
                           !Node.has(nextEditor, editor.selection.focus.path))) {
    Transforms.deselect(editor);
  }
}
