import React from 'react';

import {FloatingPortal} from '@floating-ui/react';

import {Badge, useAnchoredFloating} from 'pageflow-scrolled/review';
import {useFloatingPortalRoot} from '../../FloatingPortalRootProvider';

export function BadgeColumn({highlights, anchors}) {
  return highlights.map(highlight => (
    <PositionedBadge key={highlight.key}
                     rangeKey={highlight.key}
                     anchors={anchors} />
  ));
}

function PositionedBadge({rangeKey, anchors}) {
  const portalRoot = useFloatingPortalRoot();

  const {refs, floatingStyles, hasAnchor} =
    useAnchoredFloating(rangeKey, anchors);

  if (!hasAnchor) return null;

  return (
    <FloatingPortal root={portalRoot}>
      <div ref={refs.setFloating} style={floatingStyles}>
        <Badge counter={1} />
      </div>
    </FloatingPortal>
  );
}
