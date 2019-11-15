pageflow.FileProcessingStateDisplayView = Backbone.Marionette.View.extend({
  className: 'file_processing_state_display',

  mixins: [pageflow.inputView],

  initialize: function() {
    if (typeof this.options.collection === 'string') {
      this.options.collection = pageflow.entry.getFileCollection(
        pageflow.editor.fileTypes.findByCollectionName(this.options.collection)
      );
    }

    this.listenTo(this.model, 'change:' + this.options.propertyName, this._update);
  },

  render: function() {
    this._update();
    return this;
  },

  _update: function() {
    if (this.fileStagesView) {
      this.stopListening(this.file.unfinishedStages);

      this.fileStagesView.close();
      this.fileStagesView = null;
    }

    this.file = this._getFile();

    if (this.file) {
      this.listenTo(this.file.unfinishedStages, 'add remove', this._updateClassNames);

      this.fileStagesView = new pageflow.CollectionView({
        tagName: 'ul',
        collection: this.file.unfinishedStages,
        itemViewConstructor: pageflow.FileStageItemView,
        itemViewOptions: {
          standAlone: true
        }
      });

      this.appendSubview(this.fileStagesView);
    }

    this._updateClassNames();
  },

  _updateClassNames: function() {
    this.$el.toggleClass('file_processing_state_display-empty', !this._hasItems());
  },

  _hasItems: function() {
    return this.file && this.file.unfinishedStages.length;
  },

  _getFile: function() {
    return this.model.getReference(this.options.propertyName, this.options.collection);
  }
});
