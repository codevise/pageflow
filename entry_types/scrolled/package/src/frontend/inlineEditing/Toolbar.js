import React from 'react';
import classNames from 'classnames';

import styles from './Toolbar.module.css';

export function Toolbar({buttons, onButtonClick}) {
  return (
    <div className={styles.Toolbar} contentEditable={false}>
      {buttons.map(button => {
        const Icon = button.icon

        return (
          <button key={button.name}
                  title={button.text}
                  className={classNames(styles.button, {[styles.activeButton]: button.active})}
                  onMouseDown={event => {
                    event.preventDefault();
                    onButtonClick(button.name)
                  }}>
            <Icon width={15} height={15} />
          </button>
        );
      })}
    </div>
  );
}
