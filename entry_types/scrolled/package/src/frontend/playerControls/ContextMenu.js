import React from 'react';
import classNames from 'classnames';

import styles from './ContextMenu.module.css';

export function ContextMenu(props) {
  function renderMenuEntries(entries) {
    return entries.map((entry) => {
      return (<li>{entry}</li>)
    })
  };

  return (
    <div className={classNames(styles.contextMenuContainer,
                               {[styles.settingsMenu]: props.settings},
                               {[styles.subtitlesMenu]: !props.settings})}>
      <div className={classNames(styles.contextMenu)}>
        <ul>
          {renderMenuEntries(props.entries)}
        </ul>
      </div>
    </div>
  );
}
