import $ from 'jquery';

$.fn.updateTitle = function () {
  if (!this.data('title')) {
    this.data('title', this.attr('title'));
  }

  if (this.hasClass('active')) {
    this.attr('title', this.data('activeTitle'));
  }
  else {
    this.attr('title', this.data('title'));
  }
};

$.fn.loadLazyImages = function() {
  this.find('img[data-src]').each(function() {
    var img = $(this);

    if (!img.attr('src')) {
      img.attr('src', img.data('src'));
    }
  });
};
