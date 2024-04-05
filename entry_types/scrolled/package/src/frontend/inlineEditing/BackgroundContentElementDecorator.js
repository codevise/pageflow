import React from 'react';

import {useEditorSelection} from './EditorState';

export function BackgroundContentElementDecorator({contentElement, children}) {
  const {isSelected} = useEditorSelection({
    id: contentElement?.id,
    type: 'contentElement'
  });

  const {isSelected: isSectionSelected} = useEditorSelection({
    id: contentElement?.sectionId,
    type: 'sectionSettings'
  });

  return (
    <div style={{pointerEvents: isSelected || isSectionSelected ? 'auto' : 'none'}}>
      {children}
    </div>
  )
}
