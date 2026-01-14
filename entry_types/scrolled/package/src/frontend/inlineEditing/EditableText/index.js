import React, {useCallback, useMemo, useEffect} from 'react';
import classNames from 'classnames';
import {createEditor, Transforms, Node, Text as SlateText, Range} from 'slate';
import {Slate, Editable, withReact, ReactEditor} from 'slate-react';
import {withHistory} from 'slate-history';

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
import {LinkTooltipProvider} from '../LinkTooltip';
import {
  applyTextAlign,
  applyTypographyVariant,
  applyTypographySize,
  applyColor,
  withBlockNormalization
} from './blocks';

import {
  decorateLineBreaks,
  useLineBreakHandler,
  withLineBreakNormalization,
  renderLeafWithLineBreakDecoration
} from './lineBreaks';

import {useShortcutHandler} from './shortcuts';
import {duplicateNodes} from './duplicateNodes';
import {computeBounds} from './computeBounds';
import {postMoveContentElementMessage} from '../postMessage';

import styles from './index.module.css';

export {
  wrapRenderElementWithLinkPreview
} from './withLinks';

export {
  decorateLineBreaks,
  useLineBreakHandler,
  useShortcutHandler,
  renderLeafWithLineBreakDecoration,
  withLinks,
  withLineBreakNormalization,
  LinkTooltipProvider,
  HoveringToolbar
};

export const selectedClassName = styles.selected;

export const EditableText = React.memo(function EditableText({
  value, contentElementId, placeholder, onChange, selectionRect, className,
  placeholderClassName, scaleCategory = 'body', typographyVariant, typographySize,
  autoFocus,
  floatingControlsPosition = 'above'
}) {
  const editor = useMemo(
    () => withLinks(
      withCustomInsertBreak(
        withBlockNormalization(
          {onlyParagraphs: !selectionRect},
          withLineBreakNormalization(
            withReact(
              withHistory(
                createEditor()
              )
            )
          )
        )
      )
    ),
    [selectionRect]
  );

  const handleLineBreaks = useLineBreakHandler(editor);
  const handleShortcuts = useShortcutHandler(editor);

  const handleKeyDown = useCallback(event => {
    handleLineBreaks(event);
    handleShortcuts(event);
  }, [handleLineBreaks, handleShortcuts]);

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
    onReset: nextValue => {
      resetSelectionIfOutsideNextValue(editor, nextValue);
      resetHistory(editor);
    }
  });

  const {isSelected} = useContentElementEditorState();

  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'REMOVE') {
      Transforms.removeNodes(editor, {mode: 'highest'});
    }
    else if (command.type === 'DUPLICATE') {
      duplicateNodes(editor);
      ReactEditor.focus(editor);
    }
    else if (command.type === 'MOVE_TO') {
      const {to} = command.payload;
      const [start, end] = computeBounds(editor);

      postMoveContentElementMessage({
        id: contentElementId,
        range: [start, end + 1],
        to
      });
    }
    else if (command.type === 'TRANSIENT_STATE_UPDATE') {
      if ('typographyVariant' in command.payload) {
        applyTypographyVariant(editor, command.payload.typographyVariant);
      }
      if ('typographySize' in command.payload) {
        applyTypographySize(editor, command.payload.typographySize);
      }
      if ('color' in command.payload) {
        applyColor(editor, command.payload.color);
      }
      if ('textAlign' in command.payload) {
        applyTextAlign(editor, command.payload.textAlign);
      }
    }
  });

  const [dropTargetsActive, ref] = useDropTargetsActive();

  return (
    <Text scaleCategory={scaleCategory}
          typographyVariant={typographyVariant}
          typographySize={typographySize}>
      <div className={classNames(styles.container, {[styles.selected]: isSelected})}
           ref={ref}>
        <Slate editor={editor} value={cachedValue} onChange={setCachedValue}>
          <LinkTooltipProvider disabled={editor.selection && !Range.isCollapsed(editor.selection)}
                               position={floatingControlsPosition}>
            {selectionRect && <Selection contentElementId={contentElementId} />}
            {dropTargetsActive && <DropTargets contentElementId={contentElementId} />}
            <HoveringToolbar>
              <Editable
                className={className}
                decorate={decorateLineBreaks}
                onKeyDown={handleKeyDown}
                renderElement={renderElementWithLinkPreview}
                renderLeaf={renderLeafWithLineBreakDecoration} />
            </HoveringToolbar>
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

function resetHistory(editor) {
  editor.history.undos = [];
  editor.history.redos = [];
}
