import React from 'react';
import MediaPlayer from './mediaPlayer';
import {useFile, useTextFromMediaFile} from '../entryState';
import { useMediaSettings, useI18n } from 'pageflow-scrolled/frontend';

export function AudioPlayer(props) {
  
  const {t} = useI18n();

  const processSources = audioFile => [
    {type: 'audio/ogg', src: `${audioFile.urls.ogg}?u=1`},
    {type: 'audio/mp4', src: `${audioFile.urls.m4a}?u=1`},
    {type: 'audio/mp3', src: `${audioFile.urls.mp3}?u=1`}
  ]
  const getPoster = function( posterImageFile) {
    return posterImageFile ? posterImageFile.urls['medium'] : undefined;
  }
  
  const file = useFile({collectionName: 'audioFiles', permaId: props.source});
  if (file) {
    const sources = processSources(file,
                                   props.quality,
                                   {hasHighBandwidth: props.hasHighBandwidth})

    var poster = undefined;
    if (props.background_type=='background_image') {
      poster = useFile({collectionName: 'imageFiles', permaId: props.background_image_id});
    }
    else {
      poster = useFile({collectionName: 'videoFiles', permaId: props.background_video_id});
    }
    const mediaSettings = useMediaSettings();
    const textFiles = useTextFromMediaFile({collectionName: 'textTrackFiles', mediaFileId: file.id});
    return (
        <MediaPlayer tagName='audio'
                     emulateTextTracksDisplay='true'
                     mediaSettings={mediaSettings}
                     textFiles={textFiles}
                     alt={file.alt}
                     file={file}
                     sources={sources}
                     t={t}
                     poster={getPoster(poster)}
                     {...props}> 
        </MediaPlayer>      
    )
  }

  return null;
}