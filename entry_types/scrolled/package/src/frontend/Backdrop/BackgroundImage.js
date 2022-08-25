import React from 'react';

import {Picture} from '../Picture';
import {MotifArea} from '../MotifArea';
import {useSectionLifecycle} from '../useSectionLifecycle';
import {useFullscreenDimensions} from '../Fullscreen';
import {Effects} from './Effects';

export function BackgroundImage({backdrop, eagerLoad, onMotifAreaUpdate}) {
  const {shouldLoad} = useSectionLifecycle();
  const renderedInSectionThumbnail = !!useFullscreenDimensions().height;

  return (
    <>
      <Effects file={backdrop.file} mobileFile={backdrop.mobileFile}>
        <Picture imageFile={backdrop.file}
                 imageFileMobile={!renderedInSectionThumbnail && backdrop.mobileFile}
                 load={shouldLoad || eagerLoad}
                 structuredData={true}
                 preferSvg={true} />
      </Effects>
      <MotifArea key={backdrop.file?.permaId}
                 onUpdate={onMotifAreaUpdate} />
    </>
  );
}
