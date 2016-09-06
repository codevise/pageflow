pageflow.TextTrackFile = pageflow.HostedFile.extend({
  defaults: {
    configuration: {
      kind: 'captions'
    }
  },

  initialize: function(attributes, options) {
    pageflow.UploadedFile.prototype.initialize.apply(this, arguments);
    if(this.isNew()) {
      this.configuration.set('srclang', this.extractLanguageCodeFromFilename());
      if(this.configuration.get('srclang' !== 'null')){
        this.configuration.set('label',
                               I18n.t('pageflow.languages.' + this.configuration.get('srclang')));
      }
    }
  },

  extractLanguageCodeFromFilename: function() {
    var matches = /\S+\.([a-z]{2})_[A-Z]{2}\.vtt/.exec(this.get('file_name'));
    return matches && matches[1];
  }
});
