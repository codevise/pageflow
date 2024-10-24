import React from 'react';

import {
  ContentElementBox,
  Image,
  ContentElementFigure,
  FitViewport,
  contentElementWidths,
  useContentElementLifecycle,
  useFileWithInlineRights,
  usePortraitOrientation,
  ExpandableImage,
  InlineFileRights
} from 'pageflow-scrolled/frontend';

export function InlineImage({contentElementId, contentElementWidth, configuration}) {
  const imageFile = useFileWithInlineRights({
    configuration, collectionName: 'imageFiles', propertyName: 'id'
  });
  const portraitImageFile = useFileWithInlineRights({
    configuration, collectionName: 'imageFiles', propertyName: 'portraitId'
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
                                   contentElementWidth={contentElementWidth}
                                   configuration={configuration} />
    );
  }
  else {
    return (
      <ImageWithCaption imageFile={imageFile}
                        contentElementId={contentElementId}
                        contentElementWidth={contentElementWidth}
                        configuration={configuration} />
    )
  }
}

function OrientationAwareInlineImage({landscapeImageFile, portraitImageFile,
                                      contentElementId, contentElementWidth,
                                      configuration}) {
  const portraitOrientation = usePortraitOrientation();
  const imageFile = portraitOrientation && portraitImageFile ?
                    portraitImageFile : landscapeImageFile;

  return (
    <ImageWithCaption imageFile={imageFile}
                      contentElementId={contentElementId}
                      contentElementWidth={contentElementWidth}
                      configuration={configuration} />
  );
}

function ImageWithCaption({imageFile, contentElementId, contentElementWidth, configuration}) {
  const {shouldLoad} = useContentElementLifecycle();
  const {enableFullscreen} = configuration;
  const supportFullscreen = enableFullscreen &&
                            contentElementWidth < contentElementWidths.full;

  return (
    <FitViewport file={imageFile}
                 aspectRatio={imageFile ? undefined : 0.75}
                 opaque={!imageFile}>
      <ContentElementBox>
        <ContentElementFigure configuration={configuration}>
          <FitViewport.Content>
            <ExpandableImage enabled={supportFullscreen && shouldLoad}
                             imageFile={imageFile}
                             contentElementId={contentElementId}>
              <Image imageFile={imageFile}
                     load={shouldLoad}
                     structuredData={true}
                     variant={contentElementWidth === contentElementWidths.full ?
                              'large' : 'medium'}
                     preferSvg={true} />
            </ExpandableImage>
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
  );
}
