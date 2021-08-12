import React, {useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import {Node, Range} from 'slate';
import {useSlate, ReactEditor} from 'slate-react';
import {useDrop} from 'react-dnd';

import {postMoveContentElementMessage} from '../postMessage';

import styles from './DropTargets.module.css';

export function DropTargets({contentElementId}) {
  const editor = useSlate();
  const [targets, setTargets] = useState();
  const containerRef = useRef();

  useEffect(() => {
    if (!targets) {
      setTargets(measureHeights(editor, containerRef.current));
    }
  }, [targets, editor]);

  return (
    <div ref={containerRef} className={styles.container}>
      {renderDropTargets(targets || [], contentElementId)}
    </div>
  );
}

function renderDropTargets(targets, contentElementId) {
  function handleDrop(item, index) {
    if (index === 0) {
      postMoveContentElementMessage({
        id: item.id,
        range: item.range,
        to: {
          at: 'before',
          id: contentElementId
        }
      });
    }
    else if (index === targets.length - 1) {
      postMoveContentElementMessage({
        id: item.id,
        range: item.range,
        to: {
          at: 'after',
          id: contentElementId
        }
      });
    }
    else {
      postMoveContentElementMessage({
        id: item.id,
        range: item.range,
        to: {
          at: 'split',
          id: contentElementId,
          splitPoint: index
        }
      });
    }
  }

  return targets.map((target, index) =>
    <DropTarget {...target}
                key={index}
                onDrop={item => handleDrop(item, index)} />
  );
}

function DropTarget({display, top, height, indicatorTop, onDrop}) {
  const [{isOver}, drop] = useDrop({
    accept: 'contentElement',
    collect: monitor => ({
      isOver: monitor.isOver()
    }),
    drop: item => onDrop(item)
  });

  return (
    <div ref={drop}
         className={classNames(styles.dropTarget, {[styles.isOver]: isOver})}
         style={{display, top, height}}>
      <div className={styles.dropIndicator}
           style={{top: indicatorTop}}/>
    </div>
  );
}

function measureHeights(editor, container) {
  const containerRect = container.getBoundingClientRect();
  let lastTargetDimensions = {top: 0, height: 0};
  let lastRectBottom = 0;

  const targetDimensions = editor.children.map((child, index) => {
    const node = Node.get(editor, [index]);
    const domNode = ReactEditor.toDOMNode(editor, node);
    const rect = domNode.getBoundingClientRect();

    const top = lastTargetDimensions.top + lastTargetDimensions.height;
    const bottom = rect.top + rect.height / 2 - containerRect.top;

    const targetDimensions = {
      top,
      height: bottom - top,
      display: editor.selection && Range.includes(editor.selection, [index]) ?
               'none' : undefined,
      indicatorTop: index > 0 ?
                    lastRectBottom + (rect.top - lastRectBottom) / 2 - containerRect.top - top :
                    0
    };

    lastRectBottom = rect.bottom;
    lastTargetDimensions = targetDimensions;

    return targetDimensions;
  });

  return [
    ...targetDimensions,
    {
      top: lastTargetDimensions.top + lastTargetDimensions.height,
      height: containerRect.height - (lastTargetDimensions.top + lastTargetDimensions.height),
      indicatorTop: containerRect.height - (lastTargetDimensions.top + lastTargetDimensions.height)
    }
  ];
}
