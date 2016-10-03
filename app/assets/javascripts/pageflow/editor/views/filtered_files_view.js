pageflow.FilteredFilesView = Backbone.Marionette.ItemView.extend({
  template: 'templates/filtered_files',
  className: 'filtered_files',

  ui: {
    banner: '.filtered_files-banner',
    filterName: '.filtered_files-filter_name'
  },

  events: {
    'click .filtered_files-reset_filter': function() {
      pageflow.editor.navigate('/files/' + this.options.fileType.collectionName, {trigger: true});
      return false;
    }
  },

  onRender: function() {
    var entry = this.options.entry;
    var fileType = this.options.fileType;
    var collection = entry.getFileCollection(fileType);

    if (this.options.filterName) {
      if (this.filteredCollection) {
        this.filteredCollection.dispose();
      }

      collection = this.filteredCollection = collection.withFilter(this.options.filterName);
    }

    this.appendSubview(new pageflow.CollectionView({
      tagName: 'ul',
      className: 'files expandable',
      collection: collection,
      itemViewConstructor: pageflow.FileItemView,
      itemViewOptions: {
        metaDataAttributes: fileType.metaDataAttributes,
        selectionHandler: this.options.selectionHandler,
      },
      blankSlateViewConstructor: Backbone.Marionette.ItemView.extend({
        template: 'templates/files_blank_slate'
      })
    }));

    this.ui.banner.toggle(!!this.options.filterName);

    if (this.options.filterName) {
      this.ui.filterName.text(this.filterDisplayName(this.options.filterName));
    }
  },

  filterDisplayName: function(name) {
    return pageflow.i18nUtils.findTranslation([
      'pageflow.editor.files.filters.' + this.options.fileType.collectionName + '.' + name,
      'pageflow.editor.files.common_filters.' + name,
    ]);
  },

  onClose: function() {
    if (this.filteredCollection) {
      this.filteredCollection.dispose();
    }
  }
});
