import React from 'react';

import {
  Image,
  Figure,
  ViewportDependentPillarBoxes,
  useContentElementLifecycle,
  useFile
} from 'pageflow-scrolled/frontend';

export function InlineImage({configuration}) {
  const {isPrepared} = useContentElementLifecycle();
  const imageFile = useFile({collectionName: 'imageFiles', permaId: configuration.id});

  return (
    <Figure caption={configuration.caption}>
      <ViewportDependentPillarBoxes file={imageFile}
                                    aspectRatio={imageFile ? undefined : 0.75}
                                    position={configuration.position}
                                    opaque={!!configuration.caption}>
        <Image {...configuration}
               isPrepared={isPrepared}
               structuredData={true}
               variant={configuration.position === 'full' ?  'large' : 'medium'} />
      </ViewportDependentPillarBoxes>
    </Figure>
  )
}
