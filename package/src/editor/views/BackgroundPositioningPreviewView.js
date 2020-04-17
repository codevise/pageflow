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
    this.update();
  },

  update: function() {
    var ratio = this.options.ratio;
    var max = this.options.maxSize;
    var width = ratio > 1 ? max : max * ratio;
    var height = ratio > 1 ? max / ratio : max;

    this.ui.image.css({
      width: width + 'px',
      height: height + 'px',
      backgroundImage: this.imageValue(),
      backgroundPosition: this.model.getFilePosition(this.options.propertyName, 'x') + '% ' +
        this.model.getFilePosition(this.options.propertyName, 'y') + '%'
    });

    this.ui.label.text(this.options.label);
  },

  imageValue: function() {
    var file = this.model.getReference(this.options.propertyName, this.options.filesCollection);
    return file ? 'url("' + file.getBackgroundPositioningImageUrl()  + '")' : 'none';
  }
});