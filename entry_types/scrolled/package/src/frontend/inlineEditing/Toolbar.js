import React from 'react';
import classNames from 'classnames';

import styles from './Toolbar.module.css';

export function Toolbar({buttons, onButtonClick, iconSize, collapsible}) {
  return (
    <div className={classNames(styles.Toolbar, {[styles.collapsible]: collapsible})}
         contentEditable={false}>
      {buttons.map(button => {
        const Icon = button.icon

        return (
          <button key={button.name}
                  title={button.text}
                  className={classNames(styles.button, {[styles.activeButton]: button.active})}
                  onMouseDown={event => {
                      event.preventDefault();
                      event.stopPropagation();

                      onButtonClick(button.name)
                    }}>
            <Icon width={iconSize} height={iconSize} />
          </button>
        );
      })}
    </div>
  );
}

Toolbar.defaultProps = {iconSize: 15};
