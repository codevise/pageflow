import React, {useMemo, useState, useCallback} from 'react';
import {createEditor, Transforms, Node, Text as SlateText} from 'slate';
import {Slate, Editable, withReact} from 'slate-react';

import {Text} from '../../Text';
import {useCachedValue} from '../useCachedValue';
import {useContentElementEditorCommandSubscription} from '../../useContentElementEditorCommandSubscription';
import {TextPlaceholder} from '../TextPlaceholder';

import {withCustomInsertBreak} from './withCustomInsertBreak';
import {
  withLinks,
  renderElementWithLinkPreview,
  renderLeafWithLinkSelection,
  decorateLinkSelection
} from './withLinks';
import {useDropTargetsActive} from './useDropTargetsActive';
import {HoveringToolbar} from './HoveringToolbar';
import {Selection} from './Selection';
import {DropTargets} from './DropTargets';
import {LinkTooltipProvider} from './LinkTooltip';

import styles from './index.module.css';

export const EditableText = React.memo(function EditableText({
  value, contentElementId, placeholder, onChange
}) {
  const editor = useMemo(() => withLinks(withCustomInsertBreak(withReact(createEditor()))), []);
  const [linkSelection, setLinkSelection] = useState();

  const [cachedValue, setCachedValue] = useCachedValue(value, {
    defaultValue: [{
      type: 'paragraph',
      children: [{ text: '' }],
    }],
    onDebouncedChange: onChange,
    onReset: nextValue => resetSelectionIfOutsideNextValue(editor, nextValue)
  });

  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'REMOVE') {
      Transforms.removeNodes(editor, {mode: 'highest'});
    }
    else if (command.type === 'TRANSIENT_STATE_UPDATE' &&
             'typographyVariant' in command.payload) {
      Transforms.setNodes(editor, {variant: command.payload.typographyVariant});
    }
  });

  const [dropTargetsActive, ref] = useDropTargetsActive();

  const decorate = useCallback(nodeEntry => {
    return decorateLinkSelection(nodeEntry, linkSelection)
  }, [linkSelection]);

  // Ensure Slate rerenders when decorations change
  // https://github.com/ianstormtaylor/slate/issues/3447
  const renderLeaf = useCallback(options => {
    return renderLeafWithLinkSelection(options);
  }, [linkSelection]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Text scaleCategory="body">
      <div className={styles.container} ref={ref}>
        <Slate editor={editor} value={cachedValue} onChange={setCachedValue}>
          <LinkTooltipProvider disabled={!!linkSelection}>
            <Selection contentElementId={contentElementId} />
            {dropTargetsActive && <DropTargets contentElementId={contentElementId} />}
            <HoveringToolbar linkSelection={linkSelection} setLinkSelection={setLinkSelection} />
            <Editable
                decorate={decorate}
                renderElement={renderElementWithLinkPreview}
                renderLeaf={renderLeaf} />
          </LinkTooltipProvider>
        </Slate>
        <TextPlaceholder text={placeholder}
                         visible={isBlank(cachedValue)} />
      </div>
    </Text>
  );
});

function isBlank(value) {
  return value.length <= 1 &&
         value[0]?.children.length <= 1 &&
         value[0].type === 'paragraph' &&
         !value[0]?.children[0]?.text;
}

function resetSelectionIfOutsideNextValue(editor, nextValue) {
  const nextEditor = {children: nextValue};

  if (editor.selection && (!hasTextAtPoint(nextEditor, editor.selection.anchor) ||
                           !hasTextAtPoint(nextEditor, editor.selection.focus))) {
    Transforms.deselect(editor);
  }
}

function hasTextAtPoint(editor, point) {
  if (!Node.has(editor, point.path)) {
    return false;
  }

  const node = Node.get(editor, point.path);
  return SlateText.isText(node) && point.offset <= node.text.length;
}
