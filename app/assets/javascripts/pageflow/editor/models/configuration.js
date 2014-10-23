pageflow.Configuration = Backbone.Model.extend({
  modelName: 'page',
  i18nKey: 'pageflow/page',

  mixins: [pageflow.transientReferences],

  defaults: {
    gradient_opacity: 100,
    display_in_navigation: true,
    transition: 'fade',
    text_position: 'left',
    invert: false,
    hide_title: false,
    autoplay: true
  },

  /**
   * Used by views (i.e. FileInputView) to get id which can be used in
   * routes to lookup configuration via its page.
   */
  getRoutableId: function() {
    return this.page.id;
  },

  getImageFileUrl: function(attribute) {
    var file = this.getImageFile(attribute);

    if (file && file.isReady()) {
      return file.get('url');
    }

    return '';
  },

  getImageFile: function(attribute) {
    return this.getReference(attribute, pageflow.imageFiles);
  },

  getFilePosition: function(attribute, coord) {
    var propertyName = this._filePositionProperty(attribute, coord);
    return this.has(propertyName) ? this.get(propertyName) : 50;
  },

  setFilePosition: function(attribute, coord, value) {
    var propertyName = this._filePositionProperty(attribute, coord);
    this.set(propertyName, value);
  },

  _filePositionProperty: function(attribute, coord) {
    return attribute.replace(/_id$/, '_' + coord);
  },

  getVideoFileSources: function(attribute) {
    var file = this.getVideoFile(attribute);

    if (file && file.isReady()) {
      return file.get('sources') ? this._appendSuffix(file.get('sources')) : '';
    }

    return '';
  },

  getVideoFile: function(attribute) {
    return this.getReference(attribute, pageflow.videoFiles);
  },

  getAudioFileSources: function(attribute) {
    var file = this.getAudioFile(attribute);

    if (file && file.isReady()) {
      return file.get('sources') ? this._appendSuffix(file.get('sources')) : '';
    }

    return '';
  },

  getAudioFile: function(attribute) {
    return this.getReference(attribute, pageflow.audioFiles);
  },

  getVideoPosterUrl: function() {
    var posterFile = this.getReference('poster_image_id', pageflow.imageFiles),
        videoFile = this.getReference('video_file_id', pageflow.videoFiles);

    if (posterFile) {
      return posterFile.get('url');
    }
    else if (videoFile) {
      return videoFile.get('poster_url');
    }

    return null;
  },

  _appendSuffix: function(sources) {
    var page = this.page;

    if (!page || !page.id) {
      return sources;
    }

    return _.map(sources, function(source) {
      var clone = _.clone(source);
      clone.src = clone.src + '?e=' + page.id;
      return clone;
    });
  }
});
