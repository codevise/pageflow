import {useCallback, useEffect, useRef} from 'react';

import {updateTextTracksMode, watchTextTracks} from './textTracks';

export function usePlayerTextTracks({playerRef, activeTextTrackFileId}) {
  const activeTextTrackFileIdRef = useRef(activeTextTrackFileId);

  useEffect(() => {
    activeTextTrackFileIdRef.current = activeTextTrackFileId;

    if (playerRef.current) {
      updateTextTracksMode(playerRef.current, activeTextTrackFileId);
    }
  }, [activeTextTrackFileId, playerRef]);

  return useCallback((player) => {
    const unwatchTextTracks = watchTextTracks(player, () => activeTextTrackFileIdRef.current);

    return () => {
      unwatchTextTracks();
    };
  }, []);
}
