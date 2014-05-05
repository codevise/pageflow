pageflow.FilesExplorerView = Backbone.Marionette.ItemView.extend({
  template: 'templates/files_explorer',
  className: 'files_explorer editor dialog',

  mixins: [pageflow.dialogView],

  ui: {
    entriesPanel: '.entries_panel',
    filesPanel: '.files_panel',
    okButton: '.ok'
  },

  events: {
    'click .ok': function() {
      if (this.options.callback) {
        this.options.callback(this._selectedFile());
      }
      this.close();
    }
  },

  initialize: function() {
    this.selection = new Backbone.Model();
    this.listenTo(this.selection, 'change:entry', function() {
      this.tabsView.refresh();
    });

    // check if the OK button should be enabled.
    this.listenTo(this.selection, 'change', function(selection, options) {
      this.ui.okButton.prop('disabled', !this._selectedFile());
    });
  },

  onRender: function() {
    this.subview(new pageflow.OtherEntriesCollectionView({
      el: this.ui.entriesPanel,
      selection: this.selection
    }));


    this.tabsView = new pageflow.TabsView({
      model: this.model,
      i18n: 'editor.files.tabs',
      defaultTab: this.options.tabName
    });

    this.tab('image_files', {
      collectionName: 'imageFiles',
      itemView: pageflow.ExplorerFileItemView
    });

    this.tab('video_files', {
      collectionName: 'videoFiles',
      itemView: pageflow.ExplorerFileItemView
    });

    this.tab('audio_files', {
      collectionName: 'audioFiles',
      itemView: pageflow.ExplorerFileItemView
    });

    this.ui.filesPanel.append(this.subview(this.tabsView).el);

    this.ui.okButton.prop('disabled', true);
  },

  tab: function(name, options) {
    this.tabsView.tab(name, _.bind(function() {
      var collection = this._collection(options.collectionName),
      disabledIds = [];

      if (collection.name) { // collection.name indicates *FilesCollection
        disabledIds = pageflow.entry.getFileCollection(collection.fileType()).pluck('id');
      }

      return new pageflow.CollectionView({
        tagName: 'ul',
        className: 'files_gallery',
        collection: collection,
        itemViewConstructor: options.itemView,
        itemViewOptions: {
          selection: this.selection,
          disabledIds: disabledIds
        },
        blankSlateViewConstructor: this._blankSlateConstructor()
      });
    }, this));
  },

  _collection: function(collectionName) {
    var collection,
        entry = this.selection.get('entry');

    if (entry) {
      collection = entry[collectionName];
      collection.fetch();
    } else {
      collection = new Backbone.Collection();
    }
    return collection;
  },

  _blankSlateConstructor: function() {
    return Backbone.Marionette.ItemView.extend({
      template: this.selection.get('entry') ? 'templates/files_gallery_blank_slate' : 'templates/files_explorer_blank_slate'
    });
  },

  _selectedFile: function() {
    var sel = this.selection,
        file;

    if ((file = sel.get('image_file'))) {
      file.set('typeName', 'ImageFile');
      return file;
    }

    if ((file = sel.get('audio_file'))) {
      file.set('typeName', 'AudioFile');
      return file;
    }

    if ((file = sel.get('video_file'))) {
      file.set('typeName', 'VideoFile');
      return file;
    }
  }
});

pageflow.FilesExplorerView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.FilesExplorerView(options));
};
