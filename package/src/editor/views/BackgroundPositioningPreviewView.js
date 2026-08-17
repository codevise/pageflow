import Marionette from 'backbone.marionette';

import template from '../templates/backgroundPositioningPreview.jst';

export const BackgroundPositioningPreviewView = Marionette.ItemView.extend({
  template,
  className: 'preview',

  modelEvents: {
    change: 'update'
  },

  ui: {
    image: '.image',
    label: '.label'
  },

  onRender: function() {
    this.renderFile();
    this.update();
  },

  // File types can crop the file themselves, which is the only way to
  // preview files that have no image to position on the server.
  renderFile: function() {
    var file = this.file();

    this.positioningView = file && file.createPositioningView({fit: 'cover'});

    if (this.positioningView) {
      this.appendSubview(this.positioningView, {to: this.ui.image});
    }
  },

  update: function() {
    var ratio = this.options.ratio;
    var max = this.options.maxSize;
    var width = ratio > 1 ? max : max * ratio;
    var height = ratio > 1 ? max / ratio : max;

    this.ui.image.css({
      width: width + 'px',
      height: height + 'px'
    });

    if (this.positioningView) {
      this.positioningView.setPosition(
        this.model.getFilePosition(this.options.propertyName, 'x'),
        this.model.getFilePosition(this.options.propertyName, 'y')
      );
    }

    this.ui.label.text(this.options.label);
  },

  file: function() {
    return this.model.getReference(this.options.propertyName, this.options.filesCollection);
  }
});
