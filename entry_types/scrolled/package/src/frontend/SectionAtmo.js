import {useEffect, useCallback} from 'react';

import { useSectionLifecycle } from './useSectionLifecycle';
import {useFile} from '../entryState';
import {processSources} from './AudioPlayer';
import { useAtmo } from './useAtmo';
import { usePrevious } from './usePrevious';

export function SectionAtmo(props) {
  const audioFile = useFile({collectionName: 'audioFiles', permaId: props.audioFilePermaId});
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
        audioFilePermaId: props.audioFilePermaId
      });
    }
  }, [atmo, audioFile, props.audioFilePermaId]);


  useSectionLifecycle({
    onActivate(){
      processAtmo();
    }
  });

  useEffect(() => {
    if (lastAudioFile !== undefined &&
        (lastAudioFile && lastAudioFile.permaId) !== (audioFile && audioFile.permaId)) {
      processAtmo();
    }
  }, [processAtmo, lastAudioFile, audioFile])

  return null;
}
