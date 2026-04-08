import React from 'react';
import {
  useFloating, FloatingPortal,
  offset, flip, autoUpdate
} from '@floating-ui/react';

import {useFloatingPortalRoot} from '../FloatingPortalRootProvider';
import useMediaQuery from '../useMediaQuery';

import styles from './FloatingAnchor.module.css';

const NARROW_BREAKPOINT = '(max-width: 960px)';

export function FloatingAnchor({children}) {
  const portalRoot = useFloatingPortalRoot();
  const isNarrow = useMediaQuery(NARROW_BREAKPOINT);

  const {refs, floatingStyles, placement} = useFloating({
    placement: isNarrow ? 'bottom-start' : 'right-start',
    middleware: [
      offset(isNarrow ? {mainAxis: -10} : {mainAxis: -16, crossAxis: -10}),
      ...(!isNarrow ? [flip({crossAxis: false, padding: 8})] : [])
    ],
    whileElementsMounted: autoUpdate
  });

  return (
    <>
      <div ref={refs.setReference} className={styles.anchor} />

      <FloatingPortal root={portalRoot}>
        <div ref={refs.setFloating}
             className={styles.floating}
             style={floatingStyles}>
          {children({placement})}
        </div>
      </FloatingPortal>
    </>
  );
}
