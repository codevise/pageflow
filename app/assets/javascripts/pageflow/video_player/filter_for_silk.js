pageflow.VideoPlayer.filterSourcesForSilkBrowser = function(playerElement) {
  if (/\bSilk\b/.test(navigator.userAgent)) {
    // keep only mp4 source
    $(playerElement).find('source').not('source[type="video/mp4"]').remove();

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