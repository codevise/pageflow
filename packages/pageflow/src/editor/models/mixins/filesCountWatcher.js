import _ from 'underscore';

export const filesCountWatcher = {
  watchFileCollection: function(name, collection) {
    this.watchedFileCollectionNames = this.watchedFileCollectionNames || [];
    this.watchedFileCollectionNames.push(name);

    this.listenTo(collection, 'change:state', function(model) {
      this.updateFilesCounts(name, collection);
    });

    this.listenTo(collection, 'add', function() {
      this.updateFilesCounts(name, collection);
    });

    this.listenTo(collection, 'remove', function() {
      this.updateFilesCounts(name, collection);
    });

    this.updateFilesCounts(name, collection);
  },

  updateFilesCounts: function(name, collection) {
    this.updateFilesCount('uploading', name, collection, function(file) {
      return file.isUploading();
    });

    this.updateFilesCount('confirmable', name, collection, function(file) {
      return file.isConfirmable();
    });

    this.updateFilesCount('pending', name, collection, function(file) {
      return file.isPending();
    });
  },

  updateFilesCount: function(trait, name, collection, filter) {
    this.set(trait + '_' + name + '_count', collection.filter(filter).length);

    this.set(trait + '_files_count', _.reduce(this.watchedFileCollectionNames, function(sum, name) {
      return sum + this.get(trait + '_' + name + '_count');
    }, 0, this));
  }
};