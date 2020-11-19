import React from 'react';

import {Image} from './../Image';
import {MotifArea} from './../MotifArea';
import {useSectionLifecycle} from './../useSectionLifecycle';

export function BackgroundImage({image, onMotifAreaUpdate, containerDimension}) {
  const {shouldLoad} = useSectionLifecycle();

  return (
    <>
      <Image imageFile={image} load={shouldLoad} structuredData={true}/>
      <MotifArea key={image?.permaId}
                 onUpdate={onMotifAreaUpdate}
                 file={image}
                 containerWidth={containerDimension.width}
                 containerHeight={containerDimension.height}/>
    </>
  );
}
