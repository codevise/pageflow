import React, {useState} from 'react';
import classNames from 'classnames';

import {Toolbar} from './Toolbar';

import styles from './SelectionRect.module.css';

import PlusIcon from './images/plus.svg';
import MoveIcon from './images/move.svg';

export function SelectionRect(props) {
  return (
    <div className={classNames(styles.main,
                               {[styles.full]: props.full,
                                [styles.inset]: props.inset,
                                [styles.selected]: props.selected,
                                [styles.draggable]: props.drag,
                                [styles.start]: props.selected && props.start,
                                [styles.end]: props.selected && props.end})}
         aria-label={props.ariaLabel}
         aria-selected={props.selected}
         data-scrollpoint={props.scrollPoint ? 'selection' : undefined}
         onClick={props.onClick}>
      {renderDragHandle(props)}
      {renderToolbar(props)}

      <InsertButton {...props} at="before" />

      {props.children}

      <InsertButton {...props} at="after" />
    </div>
  );
}

function InsertButton(props) {
  const [insertHovered, setInsertHovered] = useState(false);

  return (
    <div className={classNames(styles[`insert-${props.at}`],
                               {[styles.insertHovered]: insertHovered})}
         contentEditable={false}>
      <button className={styles.insertButton}
              title={props.insertButtonTitles && props.insertButtonTitles[props.at]}
              onMouseDown={event => event.preventDefault()}
              onClick={() => props.onInsertButtonClick(props.at)}
              onMouseEnter={() => setInsertHovered(true)}
              onMouseLeave={() => setInsertHovered(false)}>
        <PlusIcon width={15} height={15} fill="currentColor" />
      </button>
    </div>
  );
}

function renderDragHandle({drag, dragHandleTitle}) {
  if (!drag) {
    return null;
  }

  return (
    <div ref={drag} className={styles.dragHandle} title={dragHandleTitle}>
      <MoveIcon />
    </div>
  );
}

function renderToolbar({toolbarButtons, onToolbarButtonClick, start}) {

  if (toolbarButtons && start) {
    return (
      <div className={styles.toolbar}>
        <Toolbar buttons={toolbarButtons}
                 collapsible={true}
                 onButtonClick={onToolbarButtonClick} />
      </div>
    );
  }
}

SelectionRect.defaultProps = {
  start: true,
  end: true
}
