import React, {useLayoutEffect, useState} from 'react';

import {FloatingPortal} from '@floating-ui/react';

import {useAnchoredFloating} from 'pageflow-scrolled/review';
import {useContentElementAttributes} from '../useContentElementAttributes';
import {useFloatingPortalRoot} from '../FloatingPortalRootProvider';
import {Popover} from './Popover';

import styles from './PopoversColumn.module.css';

const WIDE_POPOVER_WIDTH = 340;

export function PopoversColumn({highlights, anchors}) {
  return highlights.map(highlight => (
    <PositionedPopover key={highlight.key}
                       rangeKey={highlight.key}
                       subjectRange={highlight.range}
                       anchors={anchors} />
  ));
}

function PositionedPopover({rangeKey, subjectRange, anchors}) {
  const portalRoot = useFloatingPortalRoot();
  const {contentElementPermaId} = useContentElementAttributes();

  const [isNarrow, setIsNarrow] = useState(false);

  const {refs, floatingStyles, placement, isPositioned, hasAnchor, fits} =
    useAnchoredFloating(rangeKey, anchors, {
      placement: isNarrow ? 'right-end' : 'right-start',
      flipOnOverflow: true,
      fitWidth: WIDE_POPOVER_WIDTH
    });

  useLayoutEffect(() => {
    if (fits === true && isNarrow) setIsNarrow(false);
    else if (fits === false && !isNarrow) setIsNarrow(true);
  }, [fits, isNarrow]);

  if (!hasAnchor) return null;

  return (
    <FloatingPortal root={portalRoot}>
      <div ref={refs.setFloating} className={styles.floating} style={floatingStyles}>
        <Popover subjectType="ContentElement"
                 subjectId={contentElementPermaId}
                 subjectRange={subjectRange}
                 placement={placement}
                 narrow={isNarrow}
                 suppressNewForm={!isPositioned}
                 hideNewTopicButton />
      </div>
    </FloatingPortal>
  );
}
