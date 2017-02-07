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
        this.options.callback(this.selection.get('entry'),
                              this.selection.get('file'));
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
      this.ui.okButton.prop('disabled', !this.selection.get('file'));
    });
  },

  onRender: function() {
    this.subview(new pageflow.OtherEntriesCollectionView({
      el: this.ui.entriesPanel,
      selection: this.selection
    }));

    this.tabsView = new pageflow.TabsView({
      model: this.model,
      i18n: 'pageflow.editor.files.tabs',
      defaultTab: this.options.tabName
    });

    pageflow.editor.fileTypes.each(function(fileType) {
      if (fileType.topLevelType) {
        this.tab(fileType);
      }
    }, this);

    this.ui.filesPanel.append(this.subview(this.tabsView).el);

    this.ui.okButton.prop('disabled', true);
  },

  tab: function(fileType) {
    this.tabsView.tab(fileType.collectionName, _.bind(function() {
      var collection = this._collection(fileType);
      var disabledIds = pageflow.entry.getFileCollection(fileType).pluck('id');

      return new pageflow.CollectionView({
        tagName: 'ul',
        className: 'files_gallery',
        collection: collection,
        itemViewConstructor: pageflow.ExplorerFileItemView,
        itemViewOptions: {
          selection: this.selection,
          disabledIds: disabledIds
        },
        blankSlateViewConstructor: this._blankSlateConstructor()
      });
    }, this));
  },

  _collection: function(fileType) {
    var collection,
        entry = this.selection.get('entry');

    if (entry) {
      collection = entry.getFileCollection(fileType);
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
  }
});

pageflow.FilesExplorerView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.FilesExplorerView(options));
};
