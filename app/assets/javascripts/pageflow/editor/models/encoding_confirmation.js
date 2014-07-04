pageflow.EncodingConfirmation = Backbone.Model.extend({
  paramRoot: 'encoding_confirmation',

  initialize: function() {
    this.videoFiles = new Backbone.Collection();
    this.audioFiles = new Backbone.Collection();

    this.watchCollections();
  },

  watchCollections: function() {
    this.listenTo(this.videoFiles, 'add remove', this.check);
    this.listenTo(this.audioFiles, 'add remove', this.check);

    this.check();
  },

  check: function() {
    var model = this;

    this.set('empty', this.videoFiles.length === 0 && this.audioFiles.length === 0);
    this.set('checking', true);

    this.save({}, {
      url: this.url() + '/check',
      success: function() {
        model.set('checking', false);
      },
      error: function() {
        model.set('checking', false);
      }
    });
  },

  url: function() {
    return '/editor/entries/' + pageflow.entry.get('id') + '/encoding_confirmations';
  },

  toJSON: function() {
    return {
      video_file_ids: this.videoFiles.pluck('id'),
      audio_file_ids: this.audioFiles.pluck('id'),
    };
  }
});