import React from 'react';

import {Image} from './../Image';
import {MotifArea} from './../MotifArea';
import {useSectionLifecycle} from './../useSectionLifecycle';

export function BackgroundImage({image, onMotifAreaUpdate, containerDimension}) {
  const {isPrepared} = useSectionLifecycle();

  return (
    <>
      <Image imageFile={image} isPrepared={isPrepared} structuredData={true}/>
      <MotifArea key={image?.permaId}
                 onUpdate={onMotifAreaUpdate}
                 file={image}
                 containerWidth={containerDimension.width}
                 containerHeight={containerDimension.height}/>
    </>
  );
}
