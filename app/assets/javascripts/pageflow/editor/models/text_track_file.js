pageflow.TextTrackFile = pageflow.HostedFile.extend({
  defaults: {
    configuration: {
      kind: 'captions'
    }
  },

  initialize: function(attributes, options) {
    pageflow.UploadedFile.prototype.initialize.apply(this, arguments);
    if (this.isNew()) {
      this.configuration.set('srclang', this.extractLanguageCodeFromFilename());
    }
  },

  extractLanguageCodeFromFilename: function() {
    var matches = /\S+\.([a-z]{2})_[A-Z]{2}\.vtt/.exec(this.get('file_name'));
    return matches && matches[1];
  }
});
