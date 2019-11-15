pageflow.FileMetaDataItemView = Backbone.Marionette.ItemView.extend({
  tagName: 'tr',
  template: 'templates/file_meta_data_item',

  ui: {
    label: 'th',
    value: 'td'
  },

  onRender: function() {
    this.subview(new this.options.valueView(_.extend({
      el: this.ui.value,
      model: this.model,
      name: this.options.name
    }, this.options.valueViewOptions || {})));

    this.ui.label.text(this.labelText());
  },

  labelText: function() {
    return pageflow.i18nUtils.attributeTranslation(this.options.name, 'label', {
      prefixes: [
        'pageflow.editor.files.attributes.' + this.model.fileType().collectionName,
        'pageflow.editor.files.common_attributes'
      ],
      fallbackPrefix: 'activerecord.attributes',
      fallbackModelI18nKey: this.model.i18nKey
    });
  }
});