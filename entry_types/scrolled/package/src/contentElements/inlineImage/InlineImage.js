import React from 'react';

import {
  ContentElementBox,
  Image,
  Figure,
  FitViewport,
  useContentElementLifecycle,
  useFile,
  usePortraitOrientation
} from 'pageflow-scrolled/frontend';

export function InlineImage({configuration}) {
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
                                   configuration={configuration} />
    );
  }
  else {
    return (
      <ImageWithCaption imageFile={imageFile}
                        configuration={configuration} />
    )
  }
}

function OrientationAwareInlineImage({landscapeImageFile, portraitImageFile, configuration}) {
  const portraitOrientation = usePortraitOrientation();
  const imageFile = portraitOrientation && portraitImageFile ?
                    portraitImageFile : landscapeImageFile;

  return (
    <ImageWithCaption imageFile={imageFile}
                      configuration={configuration} />
  );
}

function ImageWithCaption({imageFile, configuration}) {
  const {shouldLoad} = useContentElementLifecycle();

  return (
    <FitViewport file={imageFile}
                 aspectRatio={imageFile ? undefined : 0.75}
                 opaque={!imageFile}>
      <ContentElementBox>
        <Figure caption={configuration.caption}>
          <FitViewport.Content>
            <Image imageFile={imageFile}
                   load={shouldLoad}
                   structuredData={true}
                   variant={configuration.position === 'full' ? 'large' : 'medium'} />
          </FitViewport.Content>
        </Figure>
      </ContentElementBox>
    </FitViewport>
  );
}
