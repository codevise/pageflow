(function() {
  pageflow.preload = {
    image: function(url) {
      return $.Deferred(function(deferred) {
        var image = new Image();

        image.onload = deferred.resolve;
        image.onerror = deferred.resolve;

        image.src = url;
      }).promise();
    },

    backgroundImage: function(element) {
      $(element).parent().addClass('load_images');

      if ($(element).length) {
        var propertyValue = window.getComputedStyle($(element)[0]).getPropertyValue('background-image');

        if (propertyValue.match(/^url/)) {
          return this.image(propertyValue.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, ''));
        }
      }

      return $.Deferred().resolve().promise();
    }
  };
}());