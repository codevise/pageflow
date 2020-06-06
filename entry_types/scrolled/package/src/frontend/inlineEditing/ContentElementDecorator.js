import React from 'react';
import classNames from 'classnames';

import {useContentElementEditorState} from '../useContentElementEditorState';
import {useI18n} from '../i18n';
import {api} from '../api';
import {SelectionRect} from './SelectionRect';
import {postInsertContentElementMessage} from './postMessage';
import styles from './ContentElementDecorator.module.css';

import {ContentElementConfigurationUpdateProvider} from './ContentElementConfigurationUpdateProvider';
import {ContentElementEditorStateProvider} from './ContentElementEditorStateProvider';

export function ContentElementDecorator(props) {
  return (
    <div className={styles.wrapper}>
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

  return (
    <SelectionRect selected={isSelected}
                   full={props.position === 'full'}
                   ariaLabel={t('pageflow_scrolled.inline_editing.select_content_element')}
                   insertButtonTitles={t('pageflow_scrolled.inline_editing.insert_content_element')}
                   onClick={() => select()}
                   onInsertButtonClick={at =>
                     postInsertContentElementMessage({id: props.id, at})}>
      {props.children}
    </SelectionRect>
  )
}
