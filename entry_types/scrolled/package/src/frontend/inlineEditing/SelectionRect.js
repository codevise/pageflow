import React, {forwardRef, useState} from 'react';
import classNames from 'classnames';

import {Toolbar} from './Toolbar';

import styles from './SelectionRect.module.css';

import PlusIcon from './images/plus.svg';
import MoveIcon from './images/move.svg';

export const SelectionRect = forwardRef(function SelectionRect(props, ref) {
  if (props.plain) {
    return renderWrapper(props, ref);
  }

  return renderWrapper(props, ref, {
    className: {
      [styles.draggable]: props.drag,
      [styles.hasCommentBadge]: props.commentBadge && !props.commentBadgeInset
    },
    before: (
      <>
        {renderDragHandle(props)}
        {renderCommentBadge(props)}
        {renderToolbar(props)}

        <InsertButton {...props} at="before" />
      </>
    ),
    after: <InsertButton {...props} at="after" />
  });
});

// Without the fixed slots around `props.children`, switching between
// plain and full rects would remount the content element.
function renderWrapper(props, ref, {className, before, after} = {}) {
  return (
    <div ref={ref}
         className={classNames(styles.main,
                               {[styles.openSides]: props.full && !props.inset,
                                [styles.tug]: props.full || props.customMargin,
                                [styles.inset]: props.inset,
                                [styles.selected]: props.selected,
                                [styles.plain]: props.plain,
                                [styles.start]: props.selected && props.start,
                                [styles.end]: props.selected && props.end},
                               className)}
         aria-label={props.ariaLabel}
         aria-selected={props.selected}
         data-scrollpoint={props.scrollPoint ? 'selection' : undefined}
         onMouseDown={props.onMouseDown}
         onClick={props.onClick}>
      {before}
      {props.children}
      {after}
    </div>
  );
}

function InsertButton(props) {
  const [insertHovered, setInsertHovered] = useState(false);

  return (
    <div className={classNames(styles[`insert-${props.at}`],
                               {[styles.insertHovered]: insertHovered})}
         contentEditable={false}>
      <button className={styles.insertButton}
              title={props.insertButtonTitles && props.insertButtonTitles[props.at]}
              onMouseDown={event => event.preventDefault()}
              onClick={() => props.onInsertButtonClick(props.at)}
              onMouseEnter={() => setInsertHovered(true)}
              onMouseLeave={() => setInsertHovered(false)}>
        <PlusIcon width={15} height={15} fill="currentColor" />
      </button>
    </div>
  );
}

function renderDragHandle({drag, dragHandleTitle}) {
  if (!drag) {
    return null;
  }

  return (
    <div ref={drag} className={styles.dragHandle} title={dragHandleTitle}>
      <MoveIcon />
    </div>
  );
}

function renderCommentBadge({commentBadge, commentBadgeInset}) {
  if (!commentBadge) {
    return null;
  }

  return (
    <div className={classNames(styles.commentBadge,
                               {[styles.commentBadgeInset]: commentBadgeInset})}
         onClick={e => e.stopPropagation()}>
      {commentBadge}
    </div>
  );
}

function renderToolbar({toolbarButtons, onToolbarButtonClick, start}) {

  if (toolbarButtons && start) {
    return (
      <div className={styles.toolbar}>
        <Toolbar buttons={toolbarButtons}
                 collapsible={true}
                 onButtonClick={onToolbarButtonClick} />
      </div>
    );
  }
}

SelectionRect.defaultProps = {
  start: true,
  end: true
}
