import React, {useRef} from 'react';

import {
  useContentElementEditorState,
  useContentElementLifecycle,
  useFile,
  Figure,
  Panorama,
  ViewportDependentPillarBoxes
} from 'pageflow-scrolled/frontend';

export function VrImage({configuration}) {
  const {shouldLoad} = useContentElementLifecycle({
    onActivate() {
      if (viewerRef.current) {
        viewerRef.current.lookAt({yaw: viewerRef.current.getYaw() + 20}, 1000);
      }
    }
  });

  const {isEditable, isSelected} = useContentElementEditorState();
  const viewerRef = useRef();

  const imageFile = useFile({collectionName: 'imageFiles', permaId: configuration.image});

  return (
    <div style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <Figure caption={configuration.caption}>
        <ViewportDependentPillarBoxes aspectRatio={configuration.position === 'full' ? 0.5 : 0.75}
                                      position={configuration.position}
                                      opaque={!!configuration.caption}>
          {renderLazyPanorama(configuration, imageFile, shouldLoad, viewerRef)}
        </ViewportDependentPillarBoxes>
      </Figure>
    </div>
  );
}

function renderLazyPanorama(configuration, imageFile, shouldLoad, viewerRef) {
  if (shouldLoad && imageFile && imageFile.isReady) {
    return (
      <Panorama imageFile={imageFile}
                initialYaw={configuration.initialYaw}
                initialPitch={configuration.initialPitch}
                viewerRef={viewerRef} />
    );
  }
}
