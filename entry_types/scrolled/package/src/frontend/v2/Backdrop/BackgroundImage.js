import React from 'react';

import {Picture} from '../../Picture';
import {MotifArea} from '../MotifArea';
import {Effects} from './Effects';

export function BackgroundImage({backdrop, onMotifAreaUpdate}) {
  return (
    <>
      <Effects file={backdrop.file} mobileFile={backdrop.mobileFile}>
        <Picture imageFile={backdrop.file}
                 imageFileMobile={backdrop.mobileFile}
                 loading="lazy"
                 structuredData={true}/>
      </Effects>
      <MotifArea key={backdrop.file?.permaId}
                 onUpdate={onMotifAreaUpdate}
                 file={backdrop.file} />
    </>
  );
}
