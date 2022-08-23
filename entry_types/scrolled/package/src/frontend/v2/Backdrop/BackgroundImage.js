import React from 'react';

import {Picture} from '../../Picture';
import {MotifArea} from '../MotifArea';
import {useSectionLifecycle} from '../../useSectionLifecycle';
import {Effects} from './Effects';

export function BackgroundImage({backdrop, eagerLoad, onMotifAreaUpdate}) {
  const {shouldLoad} = useSectionLifecycle();

  return (
    <>
      <Effects file={backdrop.file} mobileFile={backdrop.mobileFile}>
        <Picture imageFile={backdrop.file}
                 imageFileMobile={backdrop.mobileFile}
                 load={shouldLoad || eagerLoad}
                 structuredData={true}/>
      </Effects>
      <MotifArea key={backdrop.file?.permaId}
                 onUpdate={onMotifAreaUpdate} />
    </>
  );
}
