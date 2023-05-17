import React from 'react';

import {
  ContentElementBox,
  Image,
  Figure,
  FitViewport,
  useContentElementLifecycle,
  useFile,
  usePortraitOrientation,
  ExpandableImage
} from 'pageflow-scrolled/frontend';

export function InlineImage({contentElementId, configuration}) {
  const imageFile = useFile({
    collectionName: 'imageFiles', permaId: configuration.id
  });
  const portraitImageFile = useFile({
    collectionName: 'imageFiles', permaId: configuration.portraitId
  });

  // Only render OrientationAwareInlineImage if a portrait image has
  // been selected. This prevents having the component rerender on
  // orientation changes even if it does not depend on orientation at
  // all.
  if (portraitImageFile) {
    return (
      <OrientationAwareInlineImage landscapeImageFile={imageFile}
                                   portraitImageFile={portraitImageFile}
                                   contentElementId={contentElementId}
                                   configuration={configuration} />
    );
  }
  else {
    return (
      <ImageWithCaption imageFile={imageFile}
                        contentElementId={contentElementId}
                        configuration={configuration} />
    )
  }
}

function OrientationAwareInlineImage({landscapeImageFile, portraitImageFile,
                                      contentElementId, configuration}) {
  const portraitOrientation = usePortraitOrientation();
  const imageFile = portraitOrientation && portraitImageFile ?
                    portraitImageFile : landscapeImageFile;

  return (
    <ImageWithCaption imageFile={imageFile}
                      contentElementId={contentElementId}
                      configuration={configuration} />
  );
}

function ImageWithCaption({imageFile, contentElementId, configuration}) {
  const {shouldLoad} = useContentElementLifecycle();
  const {enableFullscreen, position} = configuration;
  const supportFullscreen = enableFullscreen && position !== "full";

  return (
    <FitViewport file={imageFile}
                 aspectRatio={imageFile ? undefined : 0.75}
                 opaque={!imageFile}>
      <ContentElementBox>
        <Figure caption={configuration.caption}>
          <FitViewport.Content>
            <ExpandableImage enabled={supportFullscreen}
                             imageFile={imageFile}
                             contentElementId={contentElementId}>
              <Image imageFile={imageFile}
                     load={shouldLoad}
                     structuredData={true}
                     variant={configuration.position === 'full' ? 'large' : 'medium'}
                     preferSvg={true} />}
            </ExpandableImage>
          </FitViewport.Content>
        </Figure>
      </ContentElementBox>
    </FitViewport>
  );
}
