import React from 'react';
import classNames from 'classnames';
import {useDrop} from 'react-dnd';

import styles from './DropTargets.module.css';

export function DropTargets({
  accept,
  canDrop,
  onDrop
}) {
  const [{canDropBefore, isBefore}, dropBefore] = useDrop({
    accept,
    canDrop: item => canDrop({at: 'before', id: item.id}),
    collect: monitor => ({
      canDropBefore: monitor.canDrop(),
      isBefore: monitor.isOver() && monitor.canDrop()
    }),
    drop: item => onDrop({at: 'before', id: item.id, range: item.range})
  });

  const [{canDropAfter, isAfter}, dropAfter] = useDrop({
    accept,
    canDrop: item => canDrop({at: 'after', id: item.id}),
    collect: monitor => ({
      canDropAfter: monitor.canDrop(),
      isAfter: monitor.isOver() && monitor.canDrop()
    }),
    drop: item => onDrop({at: 'after', id: item.id, range: item.range})
  });

  return (
    <>
      {canDropBefore &&
       <div ref={dropBefore}
            data-testid="drop-before"
            className={classNames(styles.before, {[styles.isOver]: isBefore})} />}
      {canDropAfter &&
       <div ref={dropAfter}
            data-testid="drop-after"
            title="bar"
            className={classNames(styles.after, {[styles.isOver]: isAfter})} />}
    </>
  );
}
