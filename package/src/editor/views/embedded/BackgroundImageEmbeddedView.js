import Marionette from 'backbone.marionette';

export const BackgroundImageEmbeddedView = Marionette.View.extend({
  modelEvents: {
    'change': 'update'
  },

  render: function() {
    this.update();
    return this;
  },

  update: function() {
    if (this.options.useInlineStyles !== false){
      this.updateInlineStyle();
    }
    else {
      this.updateClassName();
    }

    if (this.options.dataSizeAttributes) {
      this.updateDataSizeAttributes();
    }
  },

  updateClassName: function() {
    this.$el.addClass('load_image');

    var propertyName = this.options.propertyName.call ?
      this.options.propertyName() :
      this.options.propertyName;
    var id = this.model.get(propertyName);
    var prefix = this.options.backgroundImageClassNamePrefix.call ?
      this.options.backgroundImageClassNamePrefix() :
      this.options.backgroundImageClassNamePrefix;

    prefix = prefix || 'image';
    var backgroundImageClassName = id && prefix + '_' + id;

    if (this.currentBackgroundImageClassName !== backgroundImageClassName) {
      this.$el.removeClass(this.currentBackgroundImageClassName);
      this.$el.addClass(backgroundImageClassName);

      this.currentBackgroundImageClassName = backgroundImageClassName;
    }
  },

  updateInlineStyle: function() {
    this.$el.css({
      backgroundImage: this.imageValue(),
      backgroundPosition: this.model.getFilePosition(this.options.propertyName, 'x') + '% ' +
        this.model.getFilePosition(this.options.propertyName, 'y') + '%'
    });
  },

  updateDataSizeAttributes: function() {
    var imageFile = this.model.getImageFile(this.options.propertyName);

    if (imageFile && imageFile.isReady()) {
      this.$el.attr('data-width',  imageFile.get('width'));
      this.$el.attr('data-height',  imageFile.get('height'));
    }
    else {
      this.$el.attr('data-width', '16');
      this.$el.attr('data-height', '9');
    }
    this.$el.css({backgroundPosition:'0 0'});
  },

  imageValue: function() {
    var url = this.model.getImageFileUrl(this.options.propertyName, {
      styleGroup: this.$el.data('styleGroup')
    });

    return url ? 'url("' + url  + '")' : 'none';
  }
});