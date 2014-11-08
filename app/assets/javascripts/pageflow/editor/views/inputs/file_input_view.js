/*global editor*/

pageflow.FileInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'templates/inputs/file_input',
  className: 'file_input',

  ui: {
    fileName: '.file_name',
    thumbnail: '.file_thumbnail',
    editPositioningButton: '.edit_positioning',
    unsetButton: '.unset'
  },

  events: {
    'click .choose': function() {
      pageflow.editor.selectFile(
        this.options.collection.name,
        this.options.fileSelectionHandler || 'pageConfiguration',
        {
          id: this.model.getRoutableId ? this.model.getRoutableId() : this.model.id,
          attributeName: this.options.propertyName
        }
      );

      return false;
    },

    'click .unset': function() {
      this.model.unsetReference(this.options.propertyName);
      return false;
    },

    'click. .edit_positioning': function() {
      pageflow.BackgroundPositioningView.open({
        model: this.model,
        propertyName: this.options.propertyName,
        filesCollection: this.options.collection
      });
      return false;
    }
  },

  initialize: function() {
    this.options = _.extend({
      positioning: true
    }, this.options);

    if (typeof this.options.collection === 'string') {
      this.options.collection = pageflow.entry.getFileCollection(
        pageflow.editor.fileTypes.findByCollectionName(this.options.collection)
      );
    }
  },

  onRender: function() {
    this.update();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.update);
  },

  update: function() {
    var file = this._getFile();

    this.ui.fileName.text(file ? file.get('file_name') : '(Kein)');
    this.ui.unsetButton.toggle(!!file);
    this.ui.editPositioningButton.toggle(this.options.positioning && !!file && file.isPositionable());

    this.subview(new pageflow.FileThumbnailView({
      el: this.ui.thumbnail,
      model: file
    }));
  },

  _getFile: function() {
    return this.model.getReference(this.options.propertyName, this.options.collection);
  }
});
