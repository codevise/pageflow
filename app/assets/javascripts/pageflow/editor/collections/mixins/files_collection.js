// Mixin for FilesCollecions
// Concrete collections need to set attribute "name". i.e. "audio_files"
pageflow.filesCollection = {
  initialize: function(models, options) {
    options = options || {};
    this.entry = options.entry;
  },

  comparator: function(file) {
    return file.get('file_name');
  },

  url: function() {
    return '/editor/entries/' + this.getEntry().get('id') + '/' + this.name;
  },

  getEntry: function() {
    return this.entry || pageflow.entry;
  },

  fileType: function() {
    var plural = _.map(this.name.split('_'), upperCaseFirst).join('');

    return plural.substring(0, plural.length-1);

    function upperCaseFirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
};
