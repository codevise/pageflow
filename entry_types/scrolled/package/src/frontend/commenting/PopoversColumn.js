import React from 'react';

import {useAnchoredFloating} from 'pageflow-scrolled/review';
import {useContentElementAttributes} from '../useContentElementAttributes';
import {Popover} from './Popover';

import styles from './PopoversColumn.module.css';

export function PopoversColumn({highlights, anchors}) {
  return highlights.map(highlight => (
    <PositionedPopover key={highlight.key}
                       rangeKey={highlight.key}
                       subjectRange={highlight.range}
                       anchors={anchors} />
  ));
}

function PositionedPopover({rangeKey, subjectRange, anchors}) {
  const {contentElementPermaId} = useContentElementAttributes();

  const {refs, floatingStyles, hasAnchor} =
    useAnchoredFloating(rangeKey, anchors, {placement: 'left-end'});

  if (!hasAnchor) return null;

  return (
    <div ref={refs.setFloating} className={styles.floating} style={floatingStyles}>
      <Popover subjectType="ContentElement"
               subjectId={contentElementPermaId}
               subjectRange={subjectRange}
               hideNewTopicButton />
    </div>
  );
}
