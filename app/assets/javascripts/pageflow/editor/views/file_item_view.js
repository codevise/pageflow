pageflow.FileItemView = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: 'templates/file_item',

  mixins: [pageflow.loadable],

  ui: {
    fileName: '.file_name',

    selectButton: '.select',
    removeButton: '.remove',
    confirmButton: '.confirm',
    cancelButton: '.cancel',
    retryButton: '.retry',

    thumbnail: '.file_thumbnail',
    stageItems: '.file_stage_items',

    rights: 'input.rights',
    metaData: 'tbody.attributes',
    downloads: 'tbody.downloads',
    downloadLink: 'a.original'
  },

  events: {
    'click .select': function() {
      this.options.selectionHandler.call(this.model);
      pageflow.editor.navigate(this.options.selectionHandler.getReferer(), {trigger: true});
      return false;
    },

    'click .cancel': 'cancel',

    'click .confirm': 'confirm',

    'click .remove': 'destroy',

    'click .retry': 'retry',

    'click .file_thumbnail': 'toggleExpanded',

    'change': 'save'
  },

  modelEvents: {
    'change': 'update'
  },

  onRender: function() {
    this.update();

    this.subview(new pageflow.FileThumbnailView({
      el: this.ui.thumbnail,
      model: this.model
    }));

    this.subview(new pageflow.CollectionView({
      el: this.ui.stageItems,
      collection: this.model.stages,
      itemViewConstructor: pageflow.FileStageItemView
    }));

    _.each(this.metaDataViews(), function(view) {
      this.ui.metaData.append(this.subview(view).el);
    }, this);
  },

  update: function() {
    this.$el.attr('data-id', this.model.id);
    this.ui.fileName.text(this.model.get('file_name') || '(Unbekannt)');

    this.ui.rights.val(this.model.get('rights'));
    this.ui.rights.attr('placeholder', pageflow.entry.get('default_file_rights'));

    this.ui.downloadLink.attr('href', this.model.get('url'));
    this.ui.downloads.toggle(this.model.isUploaded());

    this.ui.selectButton.toggle(!!this.options.selectionHandler);

    this.ui.cancelButton.toggle(this.model.isUploading());
    this.ui.confirmButton.toggle(this.model.isConfirmable());
    this.ui.removeButton.toggle(!this.model.isUploading());
    this.ui.retryButton.toggle(this.model.isRetryable());

    this.updateToggleTitle();
  },

  save: function() {
    this.model.save({
      rights: this.ui.rights.val()
    });
  },

  metaDataViews: function() {
    return [];
  },

  toggleExpanded: function() {
    this.$el.toggleClass('expanded');
    this.updateToggleTitle();
  },

  updateToggleTitle: function() {
    this.ui.thumbnail.attr('title', this.$el.hasClass('expanded') ? 'Details ausblenden' : 'Details einblenden');
  },

  destroy: function() {
    if (confirm("Datei wirklich wirklich löschen?")) {
      this.model.destroyUsage();
    }
  },

  cancel: function() {
    this.model.cancelUpload();
  },

  confirm: function() {
    pageflow.editor.navigate('/confirmable_files?type=' + this.model.modelName + '&id=' + this.model.id, {trigger: true});
  },

  retry: function() {
    this.model.retry();
  }
});
