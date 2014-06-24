pageflow.OtherEntry = Backbone.Model.extend({
  paramRoot: 'entry',
  urlRoot: '/entries',
  modelName: 'entry',
  i18nKey: 'pageflow/entry',

  initialize: function() {
    this.imageFiles = new pageflow.ImageFilesCollection([], {entry: this});
    this.videoFiles = new pageflow.VideoFilesCollection([], {entry: this});
    this.audioFiles = new pageflow.AudioFilesCollection([], {entry: this});
  },

  titleOrSlug: function () {
    return this.get('title') || this.get('slug');
  }
});
