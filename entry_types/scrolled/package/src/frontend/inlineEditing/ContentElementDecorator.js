import React from 'react';
import {useDrag} from 'react-dnd';

import {useContentElementEditorState} from '../useContentElementEditorState';
import {useI18n} from '../i18n';
import {api} from '../api';
import {SelectionRect} from './SelectionRect';
import {DropTargets} from './DropTargets';
import {
  postInsertContentElementMessage,
  postMoveContentElementMessage
} from './postMessage';
import styles from './ContentElementDecorator.module.css';

import {ContentElementConfigurationUpdateProvider} from './ContentElementConfigurationUpdateProvider';
import {ContentElementEditorStateProvider} from './ContentElementEditorStateProvider';

export function ContentElementDecorator(props) {
  return (
    <div className={styles.wrapper} data-scrollpoint={props.id}>
      <ContentElementEditorStateProvider id={props.id}>
        <OptionalSelectionRect {...props}>
          <ContentElementConfigurationUpdateProvider id={props.id} permaId={props.permaId}>
            {props.children}
          </ContentElementConfigurationUpdateProvider>
        </OptionalSelectionRect>
      </ContentElementEditorStateProvider>
    </div>
  );
}

function OptionalSelectionRect(props) {
  const {customSelectionRect} = api.contentElementTypes.getOptions(props.type) || {};

  if (customSelectionRect) {
    return props.children;
  }
  else {
    return (
      <DefaultSelectionRect {...props}>
        {props.children}
      </DefaultSelectionRect>
    );
  }
}

function DefaultSelectionRect(props) {
  const {isSelected, select} = useContentElementEditorState();
  const {t} = useI18n({locale: 'ui'});

  const [, drag, preview] = useDrag({
    item: { type: 'contentElement', id: props.id }
  });

  return (
    <SelectionRect selected={isSelected}
                   scrollPoint={isSelected}
                   drag={drag}
                   dragHandleTitle={t('pageflow_scrolled.inline_editing.drag_content_element')}
                   full={props.position === 'full'}
                   ariaLabel={t('pageflow_scrolled.inline_editing.select_content_element')}
                   insertButtonTitles={t('pageflow_scrolled.inline_editing.insert_content_element')}
                   onClick={() => select()}
                   onInsertButtonClick={at =>
                     postInsertContentElementMessage({id: props.id, at})}>
      <div ref={preview}>
        {props.children}
      </div>
      <DropTargets accept="contentElement"
                   canDrop={({id}) => id !== props.id}
                   onDrop={({id, at}) =>
                     postMoveContentElementMessage({id, to: {id: props.id, at}})}/>
    </SelectionRect>
  )
}
