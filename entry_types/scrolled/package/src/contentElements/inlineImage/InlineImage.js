import React from 'react';

import {
  ContentElementBox,
  Image,
  ContentElementFigure,
  FilePlaceholder,
  FitViewport,
  contentElementWidths,
  useContentElementLifecycle,
  useFileWithInlineRights,
  usePortraitOrientation,
  ExpandableImage,
  InlineFileRights,
  processImageModifiers,
  useFileWithCropPosition
} from 'pageflow-scrolled/frontend';
import {features} from 'pageflow/frontend';

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
                 aspectRatio={aspectRatio}
                 fallbackAspectRatio={0.75}>
      <ContentElementBox borderRadius={isCircleCrop ? 'none' : rounded}
                         configuration={isCircleCrop ? undefined : configuration}>
        <ContentElementFigure configuration={configuration}>
          <FitViewport.Content>
            <ContentElementBox borderRadius={isCircleCrop ? 'circle' : 'none'}
                               configuration={isCircleCrop ? configuration : undefined}
                               positioned={isCircleCrop}>
              <ExpandableImage enabled={supportFullscreen && shouldLoad}
                               imageFile={imageFile}
                               contentElementId={contentElementId}>
                <FilePlaceholder file={imageFile} />
                <Image imageFile={imageFile}
                       load={shouldLoad}
                       structuredData={true}
                       {...imageVariantAndSizes(contentElementWidth)}
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

function imageVariantAndSizes(contentElementWidth) {
  if (!features.isEnabled('image_srcset')) {
    return {
      variant: contentElementWidth === contentElementWidths.full ? 'large' : 'medium'
    };
  }

  if (contentElementWidth >= contentElementWidths.xl) {
    return {
      variant: ['medium', 'large', 'ultra'],
      sizes: contentElementWidth === contentElementWidths.full ?
             '100vw' : '(min-width: 950px) 1200px, 100vw'
    };
  }

  if (contentElementWidth >= contentElementWidths.md) {
    return {
      variant: ['medium', 'large'],
      sizes: '(min-width: 950px) 950px, 100vw'
    };
  }

  return {variant: 'medium'};
}

