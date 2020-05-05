import React from 'react';

import {useEditorSelection} from '../EditorState';
import {SelectionRect} from './SelectionRect';
import {postInsertContentElementMessage} from './postMessage';
import styles from './ContentElementDecorator.module.css';

export function ContentElementDecorator(props) {
  const {isSelected, select} = useEditorSelection({id: props.id, type: 'contentElement'});

  return (
    <div className={styles.wrapper}>
      <SelectionRect selected={isSelected}
                     onClick={() => select()}
                     onInsertButtonClick={position =>
                       postInsertContentElementMessage({id: props.id, position})}>
        {props.children}
      </SelectionRect>
    </div>
  );
}
