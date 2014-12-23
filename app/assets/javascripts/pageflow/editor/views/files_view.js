pageflow.FilesView = Backbone.Marionette.ItemView.extend({
  template: 'templates/files',
  className: 'manage_files',

  events: {
    'click a.back': 'goBack',

    'file-selected': 'updatePage'
  },

  onRender: function() {
    this.addFileModel = new Backbone.Model({
      label: I18n.t('pageflow.editor.views.files_view.add'),
      options: [
        {
          label: I18n.t('pageflow.editor.views.files_view.upload'),
          handler: this.upload.bind(this)
        },
        {
          label: I18n.t('pageflow.editor.views.files_view.reuse'),
          handler: function() {
            pageflow.FilesExplorerView.open({
              callback: pageflow.entry.addFileUsage.bind(pageflow.entry)
            });
          }
        }
      ]
    });

    this.$el.append(this.subview(new pageflow.SelectButtonView({model: this.addFileModel })).el);

    this.tabsView = new pageflow.TabsView({
      model: this.model,
      i18n: 'pageflow.editor.files.tabs',
      defaultTab: this.options.tabName
    });

    pageflow.editor.fileTypes.each(function(fileType) {
      this.tab(fileType);
    }, this);

    this.$el.append(this.subview(this.tabsView).el);
  },

  tab: function(fileType) {
    this.tabsView.tab(fileType.collectionName, _.bind(function() {
      return this.subview(new pageflow.CollectionView({
        tagName: 'ul',
        className: 'files expandable',
        collection: pageflow.entry.getFileCollection(fileType),
        itemViewConstructor: pageflow.FileItemView,
        itemViewOptions: {
          metaDataAttributes: fileType.metaDataAttributes,
          selectionHandler: this.options.tabName === fileType.collectionName && this.options.selectionHandler
        },
        blankSlateViewConstructor: Backbone.Marionette.ItemView.extend({
          template: 'templates/files_blank_slate'
        })
      }));
    }, this));

    this.listenTo(this.model, 'change:uploading_' + fileType.collectionName +'_count', function(model, value) {
      this.tabsView.toggleSpinnerOnTab(fileType.collectionName, value > 0);
    });
  },

  goBack: function() {
    if (this.options.selectionHandler) {
      editor.navigate(this.options.selectionHandler.getReferer(), {trigger: true});
    }
    else {
      editor.navigate('/', {trigger: true});
    }
  },

  upload: function() {
    pageflow.app.trigger('request-upload');
  }
});
