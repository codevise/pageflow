import React from 'react';

import {MediaPlayerControls} from './MediaPlayerControls';
import {useFile} from '../entryState';

export function AudioPlayerControls(props) {
  const file = useFile({collectionName: 'audioFiles', permaId: props.audioFilePermaId})
  return (
    <MediaPlayerControls {...props} file={file} />
  );
}
