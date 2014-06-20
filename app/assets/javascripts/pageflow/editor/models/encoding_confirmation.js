pageflow.EncodingConfirmation = Backbone.Model.extend({
  paramRoot: 'encoding_confirmation',

  initialize: function() {
    this.videoFiles = new Backbone.Collection();
    this.audioFiles = new Backbone.Collection();

    this.watchEmpty();
  },

  watchEmpty: function() {
    this.listenTo(this.videoFiles, 'add remove', this.updateEmpty);
    this.listenTo(this.audioFiles, 'add remove', this.updateEmpty);
    this.updateEmpty();
  },

  updateEmpty: function() {
    this.set('empty', this.videoFiles.length === 0 && this.audioFiles.length === 0);
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