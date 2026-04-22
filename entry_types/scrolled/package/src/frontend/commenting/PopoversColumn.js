import React from 'react';

import {FloatingPortal} from '@floating-ui/react';

import {useAnchoredFloating} from 'pageflow-scrolled/review';
import {useContentElementAttributes} from '../useContentElementAttributes';
import {useFloatingPortalRoot} from '../FloatingPortalRootProvider';
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
  const portalRoot = useFloatingPortalRoot();
  const {contentElementPermaId} = useContentElementAttributes();

  const {refs, floatingStyles, placement, isPositioned, hasAnchor} =
    useAnchoredFloating(rangeKey, anchors);

  if (!hasAnchor) return null;

  return (
    <FloatingPortal root={portalRoot}>
      <div ref={refs.setFloating} className={styles.floating} style={floatingStyles}>
        <Popover subjectType="ContentElement"
                 subjectId={contentElementPermaId}
                 subjectRange={subjectRange}
                 placement={placement}
                 suppressNewForm={!isPositioned}
                 hideNewTopicButton />
      </div>
    </FloatingPortal>
  );
}
