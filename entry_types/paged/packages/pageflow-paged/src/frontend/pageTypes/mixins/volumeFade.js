import _ from 'underscore';

export const volumeFade = {
  fadeSound: function(media, endVolume, fadeTime) {
    var fadeResolution = 10;
    var startVolume = media.volume();
    var steps = fadeTime / fadeResolution;
    var leap = (endVolume - startVolume) / steps;

    clearInterval(this.fadeInterval);

    if(endVolume != startVolume) {
      var fade = this.fadeInterval = setInterval(_.bind(function() {
        media.volume(media.volume() + leap);
        if ((media.volume() >= endVolume && endVolume >= startVolume) ||
          (media.volume() <= endVolume && endVolume <= startVolume)) {
          clearInterval(fade);
        }
      }, this), fadeResolution);
    }
  }
};