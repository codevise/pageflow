import React from 'react';
import classNames from 'classnames';

import {useWidgetEditorState} from './SelectableWidgetDecorator';

import styles from './WidgetSelectionRect.module.css';

export function WidgetSelectionRect({children}) {
  const {select, isSelected} = useWidgetEditorState();

  return (
    <div className={classNames(styles.wrapper,
                               {[styles.selected]: isSelected})}
         onClick={() => select()}>
      {children}
    </div>
  );
}
