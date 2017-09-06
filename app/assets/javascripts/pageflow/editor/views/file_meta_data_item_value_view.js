/**
 * Base class for views used as `valueView` for file type meta data
 * attributes.
 *
 * @param {string} [options.name]
 *   Name of the meta data item used in translation keys.
 *
 * @param {string} [options.settingsDialogTabLink]
 *   Dispaly a link to open the specified tab of the file settings
 *   dialog.
 *
 * @since 12.0
 *
 * @class
 * @memberof module:pageflow/editor
 */
pageflow.FileMetaDataItemValueView = Backbone.Marionette.ItemView.extend({
  template: 'templates/file_meta_data_item_value_view',

  ui: {
    value: '.value',
    editLink: '.edit'
  },

  events: {
    'click .edit': function() {
      pageflow.FileSettingsDialogView.open({
        model: this.model,
        tabName: this.options.settingsDialogTabLink
      });
    }
  },

  modelEvents: {
    'change': 'toggleEditLink'
  },

  onRender: function() {
    this.listenTo(this.model, 'change:' + this.options.name, this.update);
    this.toggleEditLink();

    this.update();
  },

  update: function() {
    this.ui.value.text(this.getText() ||
                       I18n.t('pageflow.editor.views.file_meta_data_item_value_view.blank'));
  },

  getText: function() {
    throw new Error('Not implemented');
  },

  toggleEditLink: function() {
    this.ui.editLink.toggle(!!this.options.settingsDialogTabLink &&
                            !this.model.isNew());
  }
});