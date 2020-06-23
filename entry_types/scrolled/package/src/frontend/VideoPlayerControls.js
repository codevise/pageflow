import React from 'react';

import {MediaPlayerControls} from './MediaPlayerControls';
import {useVideoQualitySetting} from './useVideoQualitySetting';
import {useFile, useAvailableQualities} from '../entryState';
import {useI18n} from './i18n';

export function VideoPlayerControls(props) {
  const [activeQuality, setActiveQuality] = useVideoQualitySetting();
  const file = useFile({collectionName: 'videoFiles', permaId: props.videoFilePermaId})
  const availableQualities = useAvailableQualities(file);
  const {t} = useI18n();

  return (
    <MediaPlayerControls {...props}
                         file={file}
                         qualityMenuItems={getQualityMenuItems(availableQualities, activeQuality, t)}
                         onQualityMenuItemClick={setActiveQuality}/>
  );
}

function getQualityMenuItems(availableQualities, activeQuality, t) {
  return availableQualities.map(quality => ({
    value: quality,
    label: t(`pageflow_scrolled.public.video_qualities.labels.${quality}`),
    annotation: t(`pageflow_scrolled.public.video_qualities.annotations.${quality}`,
                  {defaultValue: ''}),
    active: activeQuality === quality
  }));
}
