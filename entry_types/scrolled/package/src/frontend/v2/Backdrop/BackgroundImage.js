import React from 'react';

import {Image} from '../../Image';
import {MotifArea} from '../MotifArea';
import {useSectionLifecycle} from '../../useSectionLifecycle';

export function BackgroundImage({image, onMotifAreaUpdate}) {
  const {shouldLoad} = useSectionLifecycle();
import {Effects} from './Effects';

  return (
    <>
      <Effects file={image}>
        <Image imageFile={image} load={shouldLoad} structuredData={true}/>
      </Effects>
      <MotifArea key={image?.permaId}
                 onUpdate={onMotifAreaUpdate}
                 file={image} />
    </>
  );
}
