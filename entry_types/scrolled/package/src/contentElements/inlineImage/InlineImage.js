import React from 'react';

import {
  Image,
  Figure,
  FitViewport,
  useContentElementLifecycle,
  useFile
} from 'pageflow-scrolled/frontend';

export function InlineImage({configuration}) {
  const {shouldLoad} = useContentElementLifecycle();
  const imageFile = useFile({collectionName: 'imageFiles', permaId: configuration.id});

  return (
    <FitViewport file={imageFile}
                                  aspectRatio={imageFile ? undefined : 0.75}>
      <Figure caption={configuration.caption}>
        <FitViewport.Content>
          <Image imageFile={imageFile}
                 load={shouldLoad}
                 structuredData={true}
                 variant={configuration.position === 'full' ?  'large' : 'medium'} />
        </FitViewport.Content>
      </Figure>
    </FitViewport>
  )
}
