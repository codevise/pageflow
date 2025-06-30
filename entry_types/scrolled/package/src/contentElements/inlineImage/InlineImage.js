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

  const imageFile = useFileWithCropPosition(
    useFileWithInlineRights({
      configuration, collectionName: 'imageFiles', propertyName: 'id'
    }),
    configuration.cropPosition
  );
  const portraitImageFile = useFileWithCropPosition(
    useFileWithInlineRights({
      configuration, collectionName: 'imageFiles', propertyName: 'portraitId'
    }),
    configuration.portraitCropPosition
  );

  // Only render OrientationAwareInlineImage if a portrait image has
  // been selected. This prevents having the component rerender on
  // orientation changes even if it does not depend on orientation at
  // all.
  if (portraitImageFile) {
    return (
      <OrientationAwareInlineImage landscapeImageFile={imageFile}
                                   portraitImageFile={portraitImageFile}
                                   landscapeImageModifiers={configuration.imageModifiers}
                                   portraitImageModifiers={configuration.portraitImageModifiers}
                                   contentElementId={contentElementId}
                                   contentElementWidth={contentElementWidth}
                                   configuration={configuration} />
    );
  }
  else {
    return (
      <ImageWithCaption imageFile={imageFile}
                        imageModifiers={configuration.imageModifiers}
                        contentElementId={contentElementId}
                        contentElementWidth={contentElementWidth}
                        configuration={configuration} />
    )
  }
}

function OrientationAwareInlineImage({landscapeImageFile, portraitImageFile,
                                      landscapeImageModifiers, portraitImageModifiers,
                                      contentElementId, contentElementWidth,
                                      configuration}) {
  const portraitOrientation = usePortraitOrientation();

  const imageFile = portraitOrientation && portraitImageFile ?
                    portraitImageFile : landscapeImageFile;

  const imageModifiers = portraitOrientation && portraitImageFile ?
                         portraitImageModifiers : landscapeImageModifiers;

  return (
    <ImageWithCaption imageFile={imageFile}
                      imageModifiers={imageModifiers}
                      contentElementId={contentElementId}
                      contentElementWidth={contentElementWidth}
                      configuration={configuration} />
  );
}

function ImageWithCaption({
  imageFile, imageModifiers,
  contentElementId, contentElementWidth, configuration
}) {
  const {shouldLoad} = useContentElementLifecycle();
  const {enableFullscreen} = configuration;
  const supportFullscreen = enableFullscreen &&
                            contentElementWidth < contentElementWidths.full;

  const {aspectRatio, rounded} = processImageModifiers(imageModifiers);
  const isCircleCrop = rounded === 'circle';

  return (
    <FitViewport file={imageFile}
                 aspectRatio={aspectRatio || (imageFile ? undefined : 0.75)}
                 opaque={!imageFile}>
      <ContentElementBox borderRadius={isCircleCrop ? 'none' : rounded}>
        <ContentElementFigure configuration={configuration}>
          <FitViewport.Content>
            <ContentElementBox borderRadius={isCircleCrop ? 'circle' : 'none'}
                               positioned={isCircleCrop}>
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
            </ContentElementBox>
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

function processImageModifiers(imageModifiers) {
  const cropValue = getModiferValue(imageModifiers, 'crop');
  const isCircleCrop = cropValue === 'circle';

  return {
    aspectRatio: isCircleCrop ? 1 : cropValue,
    rounded: isCircleCrop ? 'circle' : getModiferValue(imageModifiers, 'rounded')
  };
}

function getModiferValue(imageModifiers, name) {
  return (imageModifiers || []).find(imageModifier => imageModifier.name === name)?.value;
}

function useFileWithCropPosition(file, cropPosition) {
  return file && {...file, cropPosition};
}
