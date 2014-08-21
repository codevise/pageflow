pageflow.Entry = Backbone.Model.extend({
  paramRoot: 'entry',
  urlRoot: '/entries',
  modelName: 'entry',
  i18nKey: 'pageflow/entry',

  mixins: [pageflow.filesCountWatcher, pageflow.polling, pageflow.failureTracking],

  initialize: function() {
    this.chapters = pageflow.chapters;
    this.chapters.parentModel = this;
    this.pages = pageflow.pages;

    this.imageFiles = pageflow.imageFiles;
    this.videoFiles = pageflow.videoFiles;
    this.audioFiles = pageflow.audioFiles;

    this.listenTo(this.chapters, 'sort', function() {
      this.pages.sort();
    });

    this.listenTo(this, 'change:title change:summary change:credits change:manual_start change:home_url change:home_button_enabled', function() {
      this.save();
    });

    this.watchFileCollection('image_files', this.imageFiles);
    this.watchFileCollection('video_files', this.videoFiles);
    this.watchFileCollection('audio_files', this.audioFiles);
  },

  addChapter: function() {
    this.chapters.create({
      entry_id: this.get('id'),
      position: this.chapters.length
    });
  },

  addFile: function(file) {
    var record;

    if (file.type.match(/^image/)) {
      record = new pageflow.ImageFile({
        state: 'uploading',
        file_name: file.name
      });
      pageflow.imageFiles.add(record);
    }
    else if (file.type.match(/^video/)) {
      record = new pageflow.VideoFile({
        state: 'uploading',
        file_name: file.name
      });
      pageflow.videoFiles.add(record);
    }
    else if (file.type.match(/^audio/)) {
      record = new pageflow.AudioFile({
        state: 'uploading',
        file_name: file.name
      });
      pageflow.audioFiles.add(record);
    }

    return record;
  },

  addFileUsage: function(file) {
    this.createFileUsage(file, { success: function(usage) {
      file.set('usage_id', usage.get('id'));
      this.addFileToCollection(file);
    }.bind(this)});
  },

  createFileUsage: function(file, options) {
    var file_usages = new pageflow.FileUsagesCollection();

    return file_usages.create({
      file_id: file.get('id'),
      file_type: file.get('typeName')
    }, options);

  },

  addFileToCollection: function (file) {
    this.getFileCollection(file.get('typeName')).add(file);
  },

  getFileCollection: function(filetype) {
    return this[lowerCaseFirst(removeNamespace(filetype)) + 's'];

    function removeNamespace(string) {
      return string.split('::').pop();
    }

    function lowerCaseFirst(string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    }
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

      this.imageFiles.set(response.image_files, {add: false, remove: false});
      this.videoFiles.set(response.video_files, {add: false, remove: false});
      this.audioFiles.set(response.audio_files, {add: false, remove: false});

      delete response.image_files;
      delete response.video_files;
      delete response.audio_files;
    }

    return response;
  },

  toJSON: function() {
    return _.pick(this.attributes, 'title', 'summary', 'credits', 'manual_start', 'home_url', 'home_button_enabled');
  }
});
