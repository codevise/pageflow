import React from 'react';
import classNames from 'classnames';

import CheckIcon from '../assets/images/playerControls/check_24px.svg';
import styles from './ContextMenu.module.css';

export function ContextMenu(props) {
  function renderMenuEntries(entries) {
    return entries.map((entry) => {
      return (
        <li key={entry.label}>
          <div className={styles.contextMenuItem}>
            <CheckIcon className={classNames(styles.contextMenuItemActiveIndicator,
                                             {[styles.active]: entry.active})}/>
            <span>{entry.label}</span>
          </div>
        </li>)
    })
  };

  return (
    <div className={classNames(styles.contextMenuContainer, props.className)}>
      <div className={classNames(styles.contextMenu)}>
        <ul>
          {renderMenuEntries(props.entries)}
        </ul>
      </div>
    </div>
  );
}
