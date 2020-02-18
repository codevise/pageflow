import React from 'react';
import classNames from 'classnames';

import {api} from './api';
import {useEditorSelection} from './EditorState';
import styles from './ContentElement.module.css';
import {InsertContentElementIndicator} from './inlineEditing/InsertContentElementIndicator';

export function ContentElement(props) {
  const Component = api.contentElementTypes.getComponent(props.type);
  const {isSelected, isSelectable, select, resetSelection} = useEditorSelection({id: props.id, type: 'contentElement'});

  if (select) {
    return (
      <div className={classNames(styles.outer)}>
        {props.first && <InsertContentElementIndicator position="before" contentElementId={props.id} />}
        <div className={classNames({[styles.selected]: isSelected, [styles.selectable]: isSelectable})}
             onClick={e => { e.stopPropagation(); isSelectable ? select() : resetSelection(); }}>
          <Component configuration={props.itemProps} />
          <div className={styles.tl} />
          <div className={styles.bl} />
          <div className={styles.tr} />
          <div className={styles.br} />
        </div>
        <InsertContentElementIndicator position="after" contentElementId={props.id} />
      </div>
    );
  }
  else {
    return (
      <Component configuration={props.itemProps} />
    );
  }
}
