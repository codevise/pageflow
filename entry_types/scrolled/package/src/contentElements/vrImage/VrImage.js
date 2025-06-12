import React, {useRef, useState} from 'react';
import {useAutoCruising} from './useAutoCruising';
import {getAspectRatio} from './getAspectRatio';

import {
  useContentElementEditorState,
  useContentElementLifecycle,
  useFileWithInlineRights,
  usePortraitOrientation,
  ContentElementBox,
  ContentElementFigure,
  Panorama,
  FitViewport,
  InlineFileRights
} from 'pageflow-scrolled/frontend';

export function VrImage({configuration, contentElementWidth}) {
  const {shouldLoad} = useContentElementLifecycle();
  const {isEditable, isSelected} = useContentElementEditorState();
  const portraitOrientation = usePortraitOrientation();

  const imageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'image'
  });

  const aspectRatio = getAspectRatio({configuration, contentElementWidth, portraitOrientation});

  return (
    <div style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <FitViewport
        aspectRatio={aspectRatio}
        fill={configuration.position === 'backdrop'}>
        <ContentElementBox>
          <ContentElementFigure configuration={configuration}>
            <FitViewport.Content>
              {renderLazyPanorama(configuration, imageFile, shouldLoad, aspectRatio)}
              <InlineFileRights configuration={configuration}
                                context="insideElement"
                                items={[{file: imageFile, label: 'image'}]} />
            </FitViewport.Content>
          </ContentElementFigure>
        </ContentElementBox>
        <InlineFileRights configuration={configuration}
                          context="afterElement"
                          items={[{file: imageFile, label: 'image'}]} />
      </FitViewport>
    </div>
  );
}

function renderLazyPanorama(configuration, imageFile, shouldLoad, aspectRatio) {
  if (shouldLoad && imageFile && imageFile.isReady) {
    return (<AutoCruisingPanorama imageFile={imageFile}
                                  key={aspectRatio}
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
