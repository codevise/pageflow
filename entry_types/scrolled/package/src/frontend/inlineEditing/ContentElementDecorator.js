import React from 'react';
import classNames from 'classnames';

import {useEditorSelection} from '../EditorState';
import styles from './ContentElementDecorator.module.css';
import {InsertContentElementIndicator} from './InsertContentElementIndicator';

export function ContentElementDecorator(props) {
  const {isSelected, select} = useEditorSelection({id: props.id, type: 'contentElement'});

  return (
    <div className={classNames(styles.outer)}>
      {props.first && <InsertContentElementIndicator position="before" contentElementId={props.id} />}
      <div className={classNames(styles.selectable, {[styles.selected]: isSelected})}
           onClick={e => { e.stopPropagation(); select(); }}>
        {props.children}
        <div className={styles.tl} />
        <div className={styles.bl} />
        <div className={styles.tr} />
        <div className={styles.br} />
      </div>
      <InsertContentElementIndicator position="after" contentElementId={props.id} />
    </div>
  );
}
