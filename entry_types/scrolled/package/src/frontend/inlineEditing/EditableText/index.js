import React, {useMemo, useEffect} from 'react';
import classNames from 'classnames';
import {createEditor, Transforms, Node, Text as SlateText} from 'slate';
import {Slate, Editable, withReact, ReactEditor} from 'slate-react';

import {Text} from '../../Text';
import {useCachedValue} from '../useCachedValue';
import {useContentElementEditorCommandSubscription} from '../../useContentElementEditorCommandSubscription';
import {useContentElementEditorState} from '../../useContentElementEditorState';
import {TextPlaceholder} from '../TextPlaceholder';

import {withCustomInsertBreak} from './withCustomInsertBreak';
import {
  withLinks,
  renderElementWithLinkPreview,
} from './withLinks';
import {useDropTargetsActive} from './useDropTargetsActive';
import {HoveringToolbar} from './HoveringToolbar';
import {Selection} from './Selection';
import {DropTargets} from './DropTargets';
import {LinkTooltipProvider} from './LinkTooltip';
import {
  applyTypograpyhVariant,
  withBlockNormalization
} from './blocks';

import {
  decorateLineBreaks,
  useLineBreakHandler,
  withLineBreakNormalization,
  renderLeafWithLineBreakDecoration
} from './lineBreaks';

import styles from './index.module.css';

export const EditableText = React.memo(function EditableText({
  value, contentElementId, placeholder, onChange, selectionRect, className,
  placeholderClassName, scaleCategory = 'body', autoFocus
}) {
  const editor = useMemo(
    () => withLinks(
      withCustomInsertBreak(
        withBlockNormalization(
          {onlyParagraphs: !selectionRect},
          withLineBreakNormalization(
            withReact(
              createEditor()
            )
          )
        )
      )
    ),
    [selectionRect]
  );
  const handleLineBreaks = useLineBreakHandler(editor);

  useEffect(() => {
    if (autoFocus) {
      ReactEditor.focus(editor);
    }
  }, [autoFocus, editor]);

  const [cachedValue, setCachedValue] = useCachedValue(value, {
    defaultValue: [{
      type: 'paragraph',
      children: [{ text: '' }],
    }],
    onDebouncedChange: onChange,
    onReset: nextValue => resetSelectionIfOutsideNextValue(editor, nextValue)
  });

  const {isSelected} = useContentElementEditorState();

  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'REMOVE') {
      Transforms.removeNodes(editor, {mode: 'highest'});
    }
    else if (command.type === 'TRANSIENT_STATE_UPDATE' &&
             'typographyVariant' in command.payload) {
      applyTypograpyhVariant(editor, command.payload.typographyVariant);
    }
  });

  const [dropTargetsActive, ref] = useDropTargetsActive();

  return (
    <Text scaleCategory={scaleCategory}>
      <div className={classNames(styles.container, {[styles.selected]: isSelected})}
           ref={ref}>
        <Slate editor={editor} value={cachedValue} onChange={setCachedValue}>
          <LinkTooltipProvider editor={editor}>
            {selectionRect && <Selection contentElementId={contentElementId} />}
            {dropTargetsActive && <DropTargets contentElementId={contentElementId} />}
            <HoveringToolbar />
            <Editable
              className={className}
              decorate={decorateLineBreaks}
              onKeyDown={handleLineBreaks}
              renderElement={renderElementWithLinkPreview}
              renderLeaf={renderLeafWithLineBreakDecoration} />
          </LinkTooltipProvider>
        </Slate>
        <TextPlaceholder text={placeholder}
                         className={placeholderClassName}
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
