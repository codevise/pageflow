import $ from 'jquery';

export const preload = {
  image: function(url) {
    return $.Deferred(function(deferred) {
      var image = new Image();

      image.onload = deferred.resolve;
      image.onerror = deferred.resolve;

      image.src = url;
    }).promise();
  },

  backgroundImage: function(element) {
    var that = this;
    var promises = [];

    $(element).addClass('load_image');

    $(element).each(function() {
      var propertyValue = window.getComputedStyle(this).getPropertyValue('background-image');

      if (propertyValue.match(/^url/)) {
        promises.push(that.image(propertyValue.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '')));
      }
    });

    return $.when.apply(null, promises);
  }
};
