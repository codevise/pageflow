import React from 'react'
import {ZoomableImage} from './ZoomableImage';
import {ToggleFullscreenCornerButton} from '../ToggleFullscreenCornerButton';
import {useContentElementEditorState} from '../useContentElementEditorState';

import {FullscreenViewer} from '../FullscreenViewer';

export default function Viewer({
  imageFile,
  contentElementId,
  children
}) {
  const {isEditable, isSelected} = useContentElementEditorState();

  return (
    <FullscreenViewer
      contentElementId={contentElementId}
      renderChildren={({enterFullscreen}) =>
        <div onClick={enterFullscreen}
             style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
          {children}
          <ToggleFullscreenCornerButton isFullscreen={false}
                                        onEnter={enterFullscreen} />
        </div>
      }
      renderFullscreenChildren={({exitFullscreen}) =>
        <ZoomableImage onClose={exitFullscreen}
                       imageFile={imageFile} />
      } />
  );
}
