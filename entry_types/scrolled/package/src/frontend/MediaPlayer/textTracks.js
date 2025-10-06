export function updateTextTracksMode(player, activeTextTrackFileId) {
  [].slice.call(player.textTracks()).forEach(textTrack => {
    if (textTrack.id === `text_track_file_${activeTextTrackFileId}`) {
      textTrack.mode = 'showing';
    }
    else {
      textTrack.mode = 'disabled';
    }
  });
}

export function watchTextTracks(player, getActiveTextTrackFileId) {
  function handleTextTracksUpdate() {
    updateTextTracksMode(player, getActiveTextTrackFileId());
  }

  player.on('play', handleTextTracksUpdate);
  player.on('texttrackchange', handleTextTracksUpdate);

  handleTextTracksUpdate();

  return () => {
    player.off('play', handleTextTracksUpdate);
    player.off('texttrackchange', handleTextTracksUpdate);
  };
}

export function getTextTrackSources(textTrackFiles, textTracksDisabled) {
  if (textTracksDisabled) {
    return [];
  }

  return textTrackFiles
    .filter(textTrackFile => textTrackFile.isReady)
    .map(textTrackFile => ({
      id: `text_track_file_${textTrackFile.id}`,
      kind: textTrackFile.configuration.kind,
      label: textTrackFile.displayLabel,
      srclang: textTrackFile.configuration.srclang,
      src: textTrackFile.urls.vtt
    }));
}
