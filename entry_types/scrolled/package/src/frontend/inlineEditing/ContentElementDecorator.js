import React from 'react';

import {useEditorSelection} from '../EditorState';
import {api} from '../api';
import {SelectionRect} from './SelectionRect';
import {postInsertContentElementMessage} from './postMessage';
import styles from './ContentElementDecorator.module.css';

import {ContentElementConfigurationUpdateProvider} from './ContentElementConfigurationUpdateProvider';

export function ContentElementDecorator(props) {
  return (
    <div className={styles.wrapper}>
      <OptionalSelectionRect {...props}>
        <ContentElementConfigurationUpdateProvider id={props.id} permaId={props.permaId}>
          {props.children}
        </ContentElementConfigurationUpdateProvider>
      </OptionalSelectionRect>
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
  const {isSelected, select} = useEditorSelection({id: props.id, type: 'contentElement'});

  return (
    <SelectionRect selected={isSelected}
                   onClick={() => select()}
                   onInsertButtonClick={at =>
                     postInsertContentElementMessage({id: props.id, at})}>
      {props.children}
    </SelectionRect>
  )
}
