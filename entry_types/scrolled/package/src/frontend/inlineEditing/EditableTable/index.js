import React, {useCallback, useMemo} from 'react';
import classNames from 'classnames';
import {createEditor, Range} from 'slate';
import {Slate, Editable, withReact} from 'slate-react';
import {withHistory} from 'slate-history';

import {useCachedValue} from '../useCachedValue';
import {useContentElementEditorState} from '../../useContentElementEditorState';

import {
  decorateLineBreaks,
  renderLeafWithLineBreakDecoration,
  selectedClassName,
  useLineBreakHandler,
  useShortcutHandler,
  withLineBreakNormalization,
  withLinks,
  wrapRenderElementWithLinkPreview,
  HoveringToolbar
} from '../EditableText';

import {
  handleTableNavigation,
  withFixedColumns
} from './withFixedColumns';

import {
  createRenderElementWithPlaceholder
} from './placeholders';

import {LinkTooltipProvider} from '../LinkTooltip';
import {usePhoneLayout} from '../../usePhoneLayout';
import tableStyles from '../../EditableTable.module.css';

export const EditableTable = React.memo(function EditableTable({
  value, onChange, className,
  labelScaleCategory = 'body',
  valueScaleCategory = 'body',
  labelPlaceholder, valuePlaceholder,
  floatingControlsPosition = 'below',
  stackedInPhoneLayout = false
}) {
  const editor = useMemo(
    () => withFixedColumns(
      withLinks(
        withLineBreakNormalization(
          withReact(
            withHistory(
              createEditor()
            )
          )
        )
      )
    ),
    []
  );

  const {isSelected} = useContentElementEditorState();
  const phoneLayout = usePhoneLayout();
  const stacked = stackedInPhoneLayout && phoneLayout;

  const handleLineBreaks = useLineBreakHandler(editor);
  const handleShortcuts = useShortcutHandler(editor);

  const handleKeyDown = useCallback(event => {
    handleLineBreaks(event);
    handleShortcuts(event);
    handleTableNavigation(editor, event, stacked);
  }, [editor, handleLineBreaks, handleShortcuts, stacked]);

  const [cachedValue, setCachedValue] = useCachedValue(value, {
    defaultValue: [{
      type: 'row',
      children: [
        {
          type: 'label',
          children: [
            {text: ''}
          ]
        },
        {
          type: 'value',
          children: [
            {text: ''}
          ]
        }
      ],
    }],
    onDebouncedChange: onChange
  });

  const showPlaceholders = cachedValue.length === 1;

  const renderElement = useMemo(
    () => wrapRenderElementWithLinkPreview(
      createRenderElementWithPlaceholder({
        labelScaleCategory, valueScaleCategory,
        labelPlaceholder, valuePlaceholder,
        showPlaceholders
      })
    ),
    [
      labelScaleCategory, valueScaleCategory,
      labelPlaceholder, valuePlaceholder,
      showPlaceholders
    ]
  );

  return (
    <Slate editor={editor} value={cachedValue} onChange={setCachedValue}>
      <LinkTooltipProvider disabled={editor.selection && !Range.isCollapsed(editor.selection)}
                           position={floatingControlsPosition}>
        <HoveringToolbar position={floatingControlsPosition} />
        <table className={classNames(className,
                                     tableStyles.table,
                                     {[selectedClassName]: isSelected})}
               data-stacked={stacked ? '' : undefined}>
          <Editable
            as="tbody"
            decorate={decorateLineBreaks}
            onKeyDown={handleKeyDown}
            renderElement={renderElement}
            renderLeaf={renderLeafWithLineBreakDecoration} />
        </table>
      </LinkTooltipProvider>
    </Slate>
  );
});
