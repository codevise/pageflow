import React from 'react';

import {FloatingPortal} from '@floating-ui/react';
import {useSlate, ReactEditor} from 'slate-react';

import {Badge, useAnchoredFloating} from 'pageflow-scrolled/review';
import {useFloatingPortalRoot} from '../../FloatingPortalRootProvider';
import {useContentElementAttributes} from '../../useContentElementAttributes';
import {useEditorSelection} from '../EditorState';
import {highlightOverlapsSelection} from './highlightOverlapsSelection';

export function BadgeColumn({highlights, anchors}) {
  const editor = useSlate();
  // Treat `editor.selection` as a live cursor only while the editor
  // is focused. After the user clicks away, slate-react's throttled
  // `selectionchange` listener can sync a clamped DOM cursor back
  // into `editor.selection`, which would otherwise flip badges back
  // to overlap mode without any actual selection.
  const editorSelection = ReactEditor.isFocused(editor) ? editor.selection : null;

  return highlights.map(highlight => (
    <PositionedBadge key={highlight.key}
                     highlight={highlight}
                     editorSelection={editorSelection}
                     anchors={anchors} />
  ));
}

function PositionedBadge({highlight, editorSelection, anchors}) {
  const portalRoot = useFloatingPortalRoot();
  const {contentElementPermaId} = useContentElementAttributes();
  const {select, isSelected: threadSelected} = useEditorSelection({
    type: 'commentThread', id: highlight.thread?.id
  });
  const {isSelected: newThreadActive} = useEditorSelection({
    type: 'newThread', id: contentElementPermaId
  });

  const {refs, floatingStyles, hasAnchor} =
    useAnchoredFloating(highlight.key, anchors);

  if (!hasAnchor) return null;

  const isActive = threadSelected ||
                   (highlight.key === 'selection' && newThreadActive);
  const mode = isActive ? 'active' :
               highlightOverlapsSelection(highlight, editorSelection) ? undefined :
               'dot';

  return (
    <FloatingPortal root={portalRoot}>
      <div ref={refs.setFloating} style={floatingStyles}>
        <Badge counter={1} mode={mode} onClick={() => select()} />
      </div>
    </FloatingPortal>
  );
}
