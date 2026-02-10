import React from 'react';
import classNames from 'classnames';

import {useFloating, FloatingPortal, autoUpdate, hide, shift} from '@floating-ui/react';

import {useFloatingPortalRoot} from '../FloatingPortalRootProvider';

import styles from './ActionButtons.module.css';

import background from './images/background.svg';
import foreground from './images/foreground.svg';
import pencil from './images/pencil.svg';
import link from './images/link.svg';
import unlink from './images/unlink.svg';

const icons = {
  background,
  foreground,
  link,
  pencil,
  unlink
};

export function ActionButtons({buttons, position, portal, floatingStrategy, size = 'md'}) {
  const iconSize = size === 'md' ? 15 : 20;

  const {refs, floatingStyles, middlewareData} = useFloating({
    strategy: floatingStrategy,
    placement: position === 'center' ? 'bottom' :
               position === 'inside' ? 'top-end' :
               position === 'outsideLeft' ? 'bottom-start' :
               position === 'topRight' ? 'top-end' :
               'bottom-end',
    middleware: portal && [
      hide({strategy: 'escaped'}),
      shift({elementContext: 'reference'})
    ],
    whileElementsMounted: autoUpdate
  });

  return (
    <span className={classNames(styles.reference,
                                styles[`position-${position}`])}
          ref={refs.setReference}>
      <Portal enabled={!!portal}
              aboveNavigationWidgets={portal === 'aboveNavigationWidgets'}>
        <div ref={refs.setFloating}
             className={classNames(styles.floating, {[styles.escaped]: middlewareData.hide?.escaped})}
             style={floatingStyles}>
          <div className={styles.buttons}>
            {buttons.map(({icon, text, onClick, iconOnly}, index) => {
              const Icon = icons[icon];
              return (
                <button key={index}
                        className={classNames(styles.button,
                                              styles[`size-${size}`],
                                              {[styles.iconOnly]: iconOnly})}
                        onClick={onClick}
                        title={iconOnly ? text : undefined}
                        aria-label={iconOnly ? text : undefined}>
                  <Icon width={iconSize} height={iconSize} />
                  {!iconOnly && text}
                </button>
              );
            })}
          </div>
        </div>
      </Portal>
    </span>
  );
}

function Portal({enabled, aboveNavigationWidgets, children}) {
  const floatingPortalRoot = useFloatingPortalRoot();

  if (enabled) {
    return (
      <FloatingPortal id={aboveNavigationWidgets ? 'floating-ui-above-navigation-widgets' : undefined}
                      root={floatingPortalRoot}>
        {children}
      </FloatingPortal>
    );
  }
  else {
    return children;
  }
}
