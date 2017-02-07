pageflow.VideoPlayer.filterSources = function(playerElement) {
  if ($(playerElement).is('video') && pageflow.browser.has('mp4 support only')) {
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