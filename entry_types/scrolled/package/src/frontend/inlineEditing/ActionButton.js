import React from 'react';
import classNames from 'classnames';

import {useFloating, FloatingPortal, autoUpdate, hide, shift} from '@floating-ui/react';

import {useFloatingPortalRoot} from '../FloatingPortalRootProvider';

import styles from './ActionButton.module.css';

import background from './images/background.svg';
import foreground from './images/foreground.svg';
import pencil from './images/pencil.svg';
import link from './images/link.svg';

const icons = {
  background,
  foreground,
  link,
  pencil
};

export function ActionButton({icon, text, position, portal, onClick, size = 'md'}) {
  const Icon = icons[icon];
  const iconSize = size === 'md' ? 15 : 20;

  const {refs, floatingStyles, middlewareData} = useFloating({
    placement: position === 'center' ? 'bottom' :
               position === 'inside' ? 'top-end' :
               position === 'outsideLeft' ? 'bottom-start' :
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
      <Portal enabled={portal}>
        <div ref={refs.setFloating}
             className={classNames(styles.floating, {[styles.escaped]: middlewareData.hide?.escaped})}
             style={floatingStyles}>
          <button className={classNames(styles.button,
                                        styles[`size-${size}`])}
                  onClick={onClick}>
            <Icon width={iconSize} height={iconSize} />
            {text}
          </button>
        </div>
      </Portal>
    </span>
  );
}

function Portal({enabled, children}) {
  const floatingPortalRoot = useFloatingPortalRoot();

  if (enabled) {
    return (
      <FloatingPortal root={floatingPortalRoot}>
        {children}
      </FloatingPortal>
    );
  }
  else {
    return children;
  }
}
