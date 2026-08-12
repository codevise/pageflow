import Marionette from 'backbone.marionette';

import template from '../templates/fileThumbnail.jst';

export const FileThumbnailView = Marionette.ItemView.extend({
  className: 'file_thumbnail',
  template,

  modelEvents: {
    'change:state': 'update'
  },

  ui: {
    pictogram: '.pictogram',
    custom: '.file_thumbnail-custom'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    if (this.model) {
      var stage = this.model.currentStage();

      if (stage) {
        this.setStageClassName(stage.get('name'));
        this.ui.pictogram.toggleClass('action_required', stage.get('action_required'));
        this.ui.pictogram.toggleClass('failed', stage.get('failed'));
      }
      else {
        this.ui.pictogram.removeClass(this.model.stages.pluck('name').join(' '));
      }

      this.ui.pictogram.addClass(this.model.thumbnailPictogram);
      this.$el.css('background-image', this._imageUrl() ? 'url(' + this._imageUrl() + ')' : '');
      this.$el
        .removeClass('empty')
        .toggleClass('always_picogram', !!this.model.thumbnailPictogram)
        .toggleClass('ready', this.model.isReady());

      this.renderCustomThumbnail();
    }
    else {
      this.$el.css('background-image', '');
      this.$el.removeClass('ready');
      this.ui.pictogram.addClass('empty');
    }
  },

  // File types can render their own thumbnail instead of the image
  // pointed at by the thumbnail url. Only created once the file is
  // ready, which is why this is retried on state changes.
  renderCustomThumbnail: function() {
    if (this.customThumbnailView) {
      return;
    }

    this.customThumbnailView = this.model.createThumbnailView();

    if (this.customThumbnailView) {
      this.appendSubview(this.customThumbnailView, {to: this.ui.custom});
    }
  },

  setStageClassName: function(name) {
    if (!this.$el.hasClass(name)) {
      this.ui.pictogram.removeClass('empty');
      this.ui.pictogram.removeClass(this.model.stages.pluck('name').join(' '));
      this.ui.pictogram.addClass(name);
    }
  },

  _imageUrl: function() {
    return this.model.get(this.options.imageUrlPropertyName || 'thumbnail_url');
  }
});