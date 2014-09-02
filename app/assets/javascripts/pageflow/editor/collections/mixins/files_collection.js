// Mixin for FilesCollecions
// Concrete collections need to set attribute "name". i.e. "audio_files"
pageflow.filesCollection = {
  initialize: function(models, options) {
    options = options || {};
    this.entry = options.entry;
  },

  comparator: function(file) {
    var fileName = file.get('file_name');
    return fileName.toLowerCase ? fileName.toLowerCase() : fileName;
  },

  url: function() {
    return '/editor/entries/' + this.getEntry().get('id') + '/' + this.name;
  },

  getEntry: function() {
    return this.entry || pageflow.entry;
  },

  confirmable: function() {
    return new pageflow.SubsetCollection({
      parent: this,
      watchAttribute: 'state',

      filter: function(item) {
        return item.get('state') === 'waiting_for_confirmation';
      },
    });
  },

  fileType: function() {
    var plural = _.map(this.name.split('_'), upperCaseFirst).join('');

    return plural.substring(0, plural.length-1);

    function upperCaseFirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
};
