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
