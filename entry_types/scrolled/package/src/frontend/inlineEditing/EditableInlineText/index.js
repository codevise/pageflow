import React, {memo, useCallback, useMemo} from 'react';
import classNames from 'classnames';
import {createEditor} from 'slate';
import {Slate, Editable, withReact} from 'slate-react';
import {withHistory} from 'slate-history';

import {TextPlaceholder} from '../TextPlaceholder';
import {useCachedValue} from '../useCachedValue';

import {useContentElementEditorState} from '../../useContentElementEditorState';

import {decorateLineBreaks, useLineBreakHandler, withLineBreakNormalization} from './lineBreaks'
import {useShortcutHandler} from './shortcuts';

import styles from './index.module.css';
import frontendStyles from '../../EditableInlineText.module.css';

export const EditableInlineText = memo(function EditableInlineText({
  value, defaultValue = '', hyphens, placeholder, onChange
}) {
  const editor = useMemo(
    () => withLineBreakNormalization(withReact(withHistory(createEditor()))),
    []
  );
  const handleLineBreaks = useLineBreakHandler(editor);
  const handleShortcuts = useShortcutHandler(editor);

  const handleKeyDown = useCallback(event => {
    handleLineBreaks(event);
    handleShortcuts(event);
  }, [handleLineBreaks, handleShortcuts]);

  const [cachedValue, setCachedValue] = useCachedValue(value, {
    defaultValue: [{
      type: 'heading',
      children: [{ text: defaultValue }],
    }],
    onDebouncedChange: onChange
  });

  const {isSelected} = useContentElementEditorState();

  return (
    <div className={classNames(frontendStyles.root,
                               frontendStyles[`hyphens-${hyphens}`],
                               {[styles.manualHyphens]: hyphens === 'manual'},
                               {[styles.selected]: isSelected})}
         spellCheck="false">
      <Slate editor={editor} value={cachedValue} onChange={setCachedValue}>
        <Editable decorate={decorateLineBreaks}
                  onKeyDown={handleKeyDown}
                  renderLeaf={renderLeaf} />
      </Slate>
      <TextPlaceholder text={placeholder}
                       visible={!cachedValue[0]?.children[0]?.text} />
    </div>
  );
});

function renderLeaf({attributes, children, leaf}) {
  if (leaf.shy) {
    children = <span className={styles.shy}>{children}</span>;
  }

  if (leaf.newLine) {
    children = <span className={styles.newLine}>{children}</span>;
  }

  return <span {...attributes}>{children}</span>;
}
