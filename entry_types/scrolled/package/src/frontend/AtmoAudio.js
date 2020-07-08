import React, { useEffect, useCallback } from 'react';

import { useSectionLifecycle } from './useSectionLifecycle';
import {useFile} from '../entryState';
import {processSources} from './AudioPlayer';
import { useAtmo } from './useAtmo';
import { usePrevious } from './usePrevious';

export function AtmoAudio(props) {
  const audioFile = useFile({collectionName: 'audioFiles', permaId: props.atmoAudioFileId});
  const lastAudioFile = usePrevious(audioFile);
  let atmo = useAtmo();
  
  let processAtmo = useCallback(()=>{
    let sources = undefined;
    if (audioFile && audioFile.isReady) {
      sources = processSources(audioFile);
    }
    if (atmo) {
      atmo.updateAtmo({
        sources: sources,
        atmoAudioFileId: props.atmoAudioFileId
      });
    }
  }, [atmo, audioFile, props.atmoAudioFileId]);


  useSectionLifecycle({
    onActivate(){
      processAtmo();
    }
  });

  useEffect(()=>{
    if (lastAudioFile && audioFile && lastAudioFile.permaId !== audioFile.permaId) {
      processAtmo();
    }
  },[processAtmo, lastAudioFile, audioFile])
  
  return null;
}
