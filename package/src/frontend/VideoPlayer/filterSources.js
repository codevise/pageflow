import {browser} from '../browser';

// TODO: Rewrite to vanilla JS
export const filterSources = function(playerElement) {
  if (!$(playerElement).is('video')) {
    return playerElement;
  }

  var changed = false;

  if (browser.has('mp4 support only')) {
    // keep only mp4 source
    $(playerElement).find('source').not('source[type="video/mp4"]').remove();
    changed = true;
  }
  else if (browser.has('mse and native hls support')) {
    // remove dash source to ensure hls is used
    $(playerElement).find('source[type="application/dash+xml"]').remove();
    changed = true;
  }

  if (changed) {
    // the video tags initially in the dom are broken since they "saw"
    // the other sources. replace with clones
    var clone = $(playerElement).clone(true);
    $(playerElement).replaceWith(clone);

    return clone[0];
  }
  else {
    return playerElement;
  }
};
