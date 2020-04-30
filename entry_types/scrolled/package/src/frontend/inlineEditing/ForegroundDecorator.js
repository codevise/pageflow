import React from 'react';

import {useEditorSelection} from '../EditorState';
import contentElementStyles from './ContentElementDecorator.module.css';

export function ForegroundDecorator(props) {
  const {resetSelection} = useEditorSelection();

  function resetSelectionIfOutsideForegroundItem(event) {
    if (!event.target.closest(`.${contentElementStyles.wrapper}`)) {
      resetSelection();
    }
  }

  return (
    <div onClick={resetSelectionIfOutsideForegroundItem}>
      {props.children}
    </div>
  );
}
