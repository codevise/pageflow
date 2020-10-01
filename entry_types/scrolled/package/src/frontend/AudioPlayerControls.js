import React from 'react';

import {MediaPlayerControls} from './MediaPlayerControls';

export function AudioPlayerControls({audioFile, ...props}) {
  return (
    <MediaPlayerControls {...props} file={audioFile} />
  );
}
