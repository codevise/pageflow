import React, {useRef, useState} from 'react';
import {useAutoCruising} from './useAutoCruising';

import {
  useContentElementEditorState,
  useContentElementLifecycle,
  useFile,
  ContentElementBox,
  Figure,
  Panorama,
  FitViewport
} from 'pageflow-scrolled/frontend';

export function VrImage({configuration}) {
  const {shouldLoad} = useContentElementLifecycle();
  const {isEditable, isSelected} = useContentElementEditorState();

  const imageFile = useFile({collectionName: 'imageFiles', permaId: configuration.image});

  return (
    <div style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <FitViewport
        aspectRatio={configuration.position === 'full' ? 0.5 : 0.75}>
        <ContentElementBox>
          <Figure caption={configuration.caption}>
            <FitViewport.Content>
              {renderLazyPanorama(configuration, imageFile, shouldLoad)}
            </FitViewport.Content>
          </Figure>
        </ContentElementBox>
      </FitViewport>
    </div>
  );
}

function renderLazyPanorama(configuration, imageFile, shouldLoad) {
  if (shouldLoad && imageFile && imageFile.isReady) {
    return (<AutoCruisingPanorama imageFile={imageFile}
                                  initialYaw={configuration.initialYaw}
                                  initialPitch={configuration.initialPitch} />)
  }
}

function AutoCruisingPanorama({
  imageFile, initialYaw, initialPitch
}) {
  const viewerRef = useRef();

  const [hidePanoramaIndicator, setHidePanoramaIndicator] = useState(false);
  const [startAutoCruising, stopAutoCruising] = useAutoCruising({
    viewerRef,
    onCancel: () => setHidePanoramaIndicator(true)
  });

  useContentElementLifecycle({
    onActivate() {
      if (viewerRef.current) {
        startAutoCruising();
      }
    }
  });

  return (
    <Panorama imageFile={imageFile}
              initialYaw={initialYaw}
              initialPitch={initialPitch}
              viewerRef={viewerRef}
              hidePanoramaIndicator={hidePanoramaIndicator}
              onReady={startAutoCruising}
              onFullscreen={stopAutoCruising} />
  );
}
