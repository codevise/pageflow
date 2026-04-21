import React from 'react';

import {FloatingPortal} from '@floating-ui/react';

import {Badge, useAnchoredFloating} from 'pageflow-scrolled/review';
import {useFloatingPortalRoot} from '../../FloatingPortalRootProvider';
import {useEditorSelection} from '../EditorState';

export function BadgeColumn({highlights, anchors}) {
  return highlights.map(highlight => (
    <PositionedBadge key={highlight.key}
                     rangeKey={highlight.key}
                     thread={highlight.thread}
                     anchors={anchors} />
  ));
}

function PositionedBadge({rangeKey, thread, anchors}) {
  const portalRoot = useFloatingPortalRoot();
  const {select} = useEditorSelection({type: 'commentThread', id: thread?.id});

  const {refs, floatingStyles, hasAnchor} =
    useAnchoredFloating(rangeKey, anchors);

  if (!hasAnchor) return null;

  return (
    <FloatingPortal root={portalRoot}>
      <div ref={refs.setFloating} style={floatingStyles}>
        <Badge counter={1} onClick={() => select()} />
      </div>
    </FloatingPortal>
  );
}
