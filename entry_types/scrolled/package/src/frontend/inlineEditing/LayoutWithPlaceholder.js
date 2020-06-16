import React from 'react';

import {LayoutWithoutInlineEditing} from '../layouts';
import {ContentElementInsertButton} from './ContentElementInsertButton';
import {useEditorSelection} from './EditorState';
import {postInsertContentElementMessage} from './postMessage';

export function LayoutWithPlaceholder(props) {
  const {isSelected} = useEditorSelection({
    id: props.sectionId,
    type: 'section'
  });

  const {isSelected: settingsSelected} = useEditorSelection({
    id: props.sectionId,
    type: 'sectionSettings'
  });

  const placeholder = isSelected || settingsSelected ?
                      <ContentElementInsertButton
                          onClick={() => postInsertContentElementMessage({at: 'endOfSection',
                                                                          id: props.sectionId})} /> :
                      null;
  return (
    <LayoutWithoutInlineEditing {...props} placeholder={placeholder}/>
  );
}
