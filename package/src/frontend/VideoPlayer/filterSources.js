import {browser} from '../browser';

export const filterSources = function(playerElement) {
  if (playerElement.tagName.toLowerCase() !== 'video') {
    return playerElement;
  }

  var changed = false;

  if (browser.has('mp4 support only')) {
    // keep only mp4 source
    playerElement.querySelectorAll('source').forEach(source => {
      if(source.type !== 'video/mp4') {
        playerElement.removeChild(source);
      }
    });
    changed = true;
  }
  else if (browser.has('mse and native hls support')) {
    // remove dash source to ensure hls is used
    const dashSource = playerElement.querySelector('source[type="application/dash+xml"]');
    if(dashSource) {
      playerElement.removeChild(dashSource);
      changed = true;
    }
  }

  if (changed) {
    // the video tags initially in the dom are broken since they "saw"
    // the other sources. replace with clone
    var clone = playerElement.cloneNode(true);
    playerElement.replaceWith(clone);

    return clone;
  }
  else {
    return playerElement;
  }
};
