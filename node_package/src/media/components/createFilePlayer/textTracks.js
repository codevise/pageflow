export function initTextTracks(player, getActiveTexTrackFileId, getPosition) {
  player.on('pause', () => {
    updateOnNextPlay(player, getActiveTexTrackFileId, getPosition);
  });

  player.textTracks().on('addtrack', () => {
    updateTextTracks(player, null, getActiveTexTrackFileId(), getPosition());
  });

  updateTextTracks(player, null, getActiveTexTrackFileId(), getPosition());
  updateOnNextPlay(player, getActiveTexTrackFileId, getPosition);
}

function updateOnNextPlay(player, getActiveTexTrackFileId, getPosition) {
  player.one('timeupdate', () => {
    updateTextTracks(player, null, getActiveTexTrackFileId(), getPosition());
  });
}

export function updateTextTracks(player, prevActiveTextTrackFileId, activeTextTrackFileId, position) {
  if (prevActiveTextTrackFileId != activeTextTrackFileId) {
    updateMode(player, activeTextTrackFileId);
  }

  updatePosition(player, position);
}

function updateMode(player, activeTextTrackFileId) {
  [].slice.call(player.textTracks()).forEach(textTrack => {
    if (textTrack.id == `text_track_file_${activeTextTrackFileId}`) {
      textTrack.mode = 'showing';
    }
    else {
      textTrack.mode = 'disabled';
    }
  });
}

function updatePosition(player, position) {
  player.updateCueLineSettings(position);
}

export function textTracksFromFiles(textTrackFiles, textTracksEnabled) {
  if (!textTracksEnabled) {
    return [];
  }

  return textTrackFiles
    .filter(textTrackFile => textTrackFile.isReady)
    .map(textTrackFile => ({
      id: `text_track_file_${textTrackFile.id}`,
      kind: textTrackFile.kind,
      label: textTrackFile.displayLabel,
      srclang: textTrackFile.srclang,
      src: textTrackFile.urls.vtt
    }));
}
