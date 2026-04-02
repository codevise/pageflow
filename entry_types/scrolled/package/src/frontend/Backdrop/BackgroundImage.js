import React from 'react';

import {Image} from '../Image';
import {MotifArea} from '../MotifArea';
import {useSectionLifecycle} from '../useSectionLifecycle';
import {Effects} from './Effects';
import {features} from 'pageflow/frontend';

export function BackgroundImage({image, onMotifAreaUpdate, containerDimension}) {
  const {shouldLoad} = useSectionLifecycle();

  return (
    <>
      <Effects file={image}>
        <Image imageFile={image}
               load={shouldLoad}
               structuredData={true}
               preferSvg={true}
               variant={features.isEnabled('image_srcset') ?
                        ['medium', 'large', 'ultra'] : 'large'} />
      </Effects>
      <MotifArea key={image?.permaId}
                 onUpdate={onMotifAreaUpdate}
                 file={image}
                 containerWidth={containerDimension.width}
                 containerHeight={containerDimension.height}/>
    </>
  );
}
