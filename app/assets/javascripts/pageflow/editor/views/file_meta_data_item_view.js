pageflow.FileMetaDataItemView = Backbone.Marionette.ItemView.extend({
  tagName: 'tr',
  template: 'templates/file_meta_data_item',

  ui: {
    label: 'th',
    value: 'td'
  },

  onRender: function() {
    this.update();
    this.listenTo(this.model, 'change:' + this.options.attribute, this.update);
  },

  update: function() {
    this.ui.label.text(I18n.t('activerecord.attributes.' + this.model.i18nKey + '.' + this.options.attribute));
    this.ui.value.text(this.model.get(this.options.attribute));
  }
});