pageflow.Entry = Backbone.Model.extend({
  paramRoot: 'entry',
  urlRoot: '/entries',
  modelName: 'entry',
  i18nKey: 'pageflow/entry',

  mixins: [pageflow.filesCountWatcher, pageflow.polling, pageflow.failureTracking],

  initialize: function(attributes, options) {
    options = options || {};

    this.files = options.files || pageflow.files;
    this.chapters = options.chapters || pageflow.chapters;
    this.chapters.parentModel = this;
    this.pages = pageflow.pages;

    this.imageFiles = pageflow.imageFiles;
    this.videoFiles = pageflow.videoFiles;
    this.audioFiles = pageflow.audioFiles;

    pageflow.editor.fileTypes.each(function(fileType) {
      this.watchFileCollection(fileType.collectionName, this.getFileCollection(fileType));
    }, this);

    this.listenTo(this.chapters, 'sort', function() {
      this.pages.sort();
    });

    this.listenTo(this, 'change:title change:summary change:credits change:manual_start change:home_url change:home_button_enabled', function() {
      this.save();
    });
  },

  addChapter: function() {
    this.chapters.create({
      entry_id: this.get('id'),
      position: this.chapters.length
    });
  },

  addFileUpload: function(upload) {
    var fileType = pageflow.editor.fileTypes.findByUpload(upload);
    var file = new fileType.model({
      state: 'uploading',
      file_name: upload.name
    });

    this.getFileCollection(fileType).add(file);

    return file;
  },

  addFileUsage: function(file) {
    var fileUsages = new pageflow.FileUsagesCollection([], {
      entry: this
    });

    fileUsages.createForFile(file, { success: function(usage) {
      file.set('usage_id', usage.get('id'));
      this.getFileCollection(file.fileType()).add(file);
    }.bind(this)});
  },

  getFileCollection: function(fileType) {
    return this.files[fileType.collectionName];
  },

  pollForPendingFiles: function() {
    this.listenTo(this, 'change:pending_files_count', function(model, value) {
      this.togglePolling(value > 0);
    });

    this.togglePolling(this.get('pending_files_count') > 0);
  },

  parse: function(response, options) {
    if (response) {
      this.set(_.pick(response, 'published', 'published_until'));

      pageflow.editor.fileTypes.each(function(fileType) {
        this.getFileCollection(fileType).set(response[fileType.collectionName], {add: false, remove: false});
        delete response[fileType.collectionName];
      }, this);
    }

    return response;
  },

  toJSON: function() {
    return _.pick(this.attributes, 'title', 'summary', 'credits', 'manual_start', 'home_url', 'home_button_enabled');
  }
});
