import React, {useCallback, useState} from 'react';
import classNames from 'classnames';
import {FloatingPortal, useFloating} from '@floating-ui/react';
import {ReactEditor, useSlate} from 'slate-react';

import {Badge, alignToContainerEdge} from 'pageflow-scrolled/review';
import {useFloatingPortalRoot} from '../../FloatingPortalRootProvider';
import {useDarkBackground} from '../../backgroundColor';
import {useEffectiveSelection} from './useEffectiveSelection';

import styles from './BadgeColumn.module.css';

export function PendingSelectionBadge({containerRef}) {
  const editor = useSlate();
  const portalRoot = useFloatingPortalRoot();
  const [isVisible, setIsVisible] = useState(false);
  const darkBackground = useDarkBackground();

  const {refs, floatingStyles} = useFloating({
    placement: 'left-start',
    middleware: [
      alignToContainerEdge(containerRef, {mainAxisOffset: 32})
    ]
  });

  useEffectiveSelection(editor, useCallback(selection => {
    if (!selection) {
      setIsVisible(false);
      return;
    }

    const domRange = ReactEditor.toDOMRange(editor, selection);
    refs.setPositionReference({
      getBoundingClientRect: () => domRange.getBoundingClientRect(),
      getClientRects: () => domRange.getClientRects()
    });
    setIsVisible(true);
  }, [editor, refs]));

  if (!isVisible) return null;

  return (
    <FloatingPortal root={portalRoot}>
      <div ref={refs.setFloating}
           className={classNames(styles.box, darkBackground ? styles.onDark : styles.onLight)}
           style={floatingStyles}>
        <Badge counter={0} mode="icon" />
      </div>
    </FloatingPortal>
  );
}
