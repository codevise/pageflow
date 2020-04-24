import React from 'react';
import classNames from 'classnames';

import styles from './ContextMenu.module.css';

export function ContextMenu(props) {
  function renderMenuEntries(entries) {
    return entries.map((entry) => {
      return (<li key={entry}>{entry}</li>)
    })
  };

  const theme = props.theme;

  return (
    <div className={classNames(styles.contextMenuContainer, props.className)}>
      <div className={classNames(styles.contextMenu, theme.contextMenu)}>
        <ul>
          {renderMenuEntries(props.entries)}
        </ul>
      </div>
    </div>
  );
}
