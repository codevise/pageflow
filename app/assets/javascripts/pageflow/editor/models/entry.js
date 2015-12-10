pageflow.Entry = Backbone.Model.extend({
  paramRoot: 'entry',
  urlRoot: '/entries',
  modelName: 'entry',
  i18nKey: 'pageflow/entry',
  collectionName: 'entries',

  autoSaveWidgets: true,

  mixins: [pageflow.filesCountWatcher,
           pageflow.polling,
           pageflow.failureTracking,
           pageflow.widgetSubject],

  initialize: function(attributes, options) {
    options = options || {};

    this.configuration = new pageflow.EntryConfiguration(this.get('configuration') || {});
    this.configuration.parent = this;

    this.files = options.files || pageflow.files;
    this.storylines = options.storylines || pageflow.storylines;
    this.storylines.parentModel = this;
    this.chapters = options.chapters || pageflow.chapters;
    this.chapters.parentModel = this;
    this.pages = pageflow.pages;

    this.imageFiles = pageflow.imageFiles;
    this.videoFiles = pageflow.videoFiles;
    this.audioFiles = pageflow.audioFiles;

    pageflow.editor.fileTypes.each(function(fileType) {
      this.watchFileCollection(fileType.collectionName, this.getFileCollection(fileType));
    }, this);

    this.listenTo(this.storylines, 'sort', function() {
      this.pages.sort();
    });

    this.listenTo(this.chapters, 'sort', function() {
      this.pages.sort();
    });

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change:configuration');
      this.save();
    });

    this.listenTo(this.configuration, 'change:locale', function() {
      this.once('sync', function() {
        // No other way of updating page templates used in
        // EntryPreviewView at the moment.
        location.reload();
      });
    });
  },

  addStoryline: function(attributes) {
    var storyline = this.buildStoryline(attributes);
    storyline.save();

    return storyline;
  },

  buildStoryline: function(attributes) {
    var defaults = {
      title: '',
    };

    return this.storylines.addAndReturnModel(_.extend(defaults, attributes));
  },

  scaffoldStoryline: function(options) {
    var scaffold = new pageflow.StorylineScaffold(this, options);
    scaffold.create();

    return scaffold;
  },

  addChapterInNewStoryline: function(options) {
    return this.scaffoldStoryline(_.extend({depth: 'chapter'}, options)).chapter;
  },

  addPageInNewStoryline: function(options) {
    return this.scaffoldStoryline(_.extend({depth: 'page'}, options)).page;
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

      this.trigger('use:file', file);
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
      this.set(_.pick(response, 'published', 'published_until', 'password_protected'));

      pageflow.editor.fileTypes.each(function(fileType) {
        this.getFileCollection(fileType).set(response[fileType.collectionName], {add: false, remove: false});
        delete response[fileType.collectionName];
      }, this);
    }

    return response;
  },

  toJSON: function() {
    return this.configuration.toJSON();
  }
});
