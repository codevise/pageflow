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
    var blankSlateText = I18n.t('pageflow.editor.templates.files_blank_slate.no_files');

    if (this.options.filterName) {
      if (this.filteredCollection) {
        this.filteredCollection.dispose();
      }

      collection = this.filteredCollection = collection.withFilter(this.options.filterName);
      blankSlateText = this.filterTranslation('blank_slate');
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
        template: 'templates/files_blank_slate',
        serializeData: function(){
          return {
            text: blankSlateText
          };
        }
      })
    }));

    this.ui.banner.toggle(!!this.options.filterName);

    if (this.options.filterName) {
      this.ui.filterName.text(this.filterTranslation('name'));
    }
  },

  filterTranslation: function(keyName, options) {
    var filterName = this.options.filterName;

    return pageflow.i18nUtils.findTranslation([
      'pageflow.editor.files.filters.' +
        this.options.fileType.collectionName + '.' +
        filterName + '.' +
        keyName,
      'pageflow.editor.files.common_filters.' + keyName
    ], options);
  },

  onClose: function() {
    if (this.filteredCollection) {
      this.filteredCollection.dispose();
    }
  }
});
