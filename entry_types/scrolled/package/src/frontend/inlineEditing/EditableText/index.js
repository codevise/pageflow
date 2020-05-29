import React, {useMemo, useState} from 'react';
import {createEditor, Transforms, Node} from 'slate';
import {Slate, Editable, withReact} from 'slate-react';

import {Text} from '../../Text';
import {renderLeaf} from '../../EditableText';
import {useCachedValue} from '../useCachedValue';
import {useContentElementEditorCommandSubscription} from '../../useContentElementEditorCommandSubscription';

import {withCustomInsertBreak} from './withCustomInsertBreak';
import {withLinks, renderElementWithLinkPreview} from './withLinks';
import {HoveringToolbar} from './HoveringToolbar';
import {Selection} from './Selection';
import {LinkTooltipProvider} from './LinkTooltip';

import styles from './index.module.css';

export const EditableText = React.memo(function EditableText({value, contentElementId, onChange}) {
  const editor = useMemo(() => withLinks(withCustomInsertBreak(withReact(createEditor()))), []);
  const [linkSelection, setLinkSelection] = useState();

  const [cachedValue, setCachedValue] = useCachedValue(value, {
    defaultValue: [{
      type: 'paragraph',
      children: [{ text: 'Your Text here...' }],
    }],
    onDebouncedChange: onChange,
    onReset: nextValue => resetSelectionIfOutsideNextValue(editor, nextValue)
  });

  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'REMOVE') {
      Transforms.removeNodes(editor, {mode: 'highest'});
    }
  });

  return (
    <Text scaleCategory="body">
      <div className={styles.container}>
        <Slate editor={editor} value={cachedValue} onChange={setCachedValue}>
          <LinkTooltipProvider disabled={!!linkSelection}>
            <Selection contentElementId={contentElementId} />
            <HoveringToolbar linkSelection={linkSelection} setLinkSelection={setLinkSelection} />
            <Editable
                renderElement={renderElementWithLinkPreview}
                renderLeaf={renderLeaf} />
          </LinkTooltipProvider>
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
