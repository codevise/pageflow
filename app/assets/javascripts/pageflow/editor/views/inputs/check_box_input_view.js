pageflow.CheckBoxInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'templates/inputs/check_box',
  className: 'check_box_input',

  events: {
    'change': 'save'
  },

  ui: {
    input: 'input',
    label: 'label'
  },

  onRender: function() {
    this.ui.label.attr('for', this.cid);
    this.ui.input.attr('id', this.cid);
    this.load();
  },

  save: function() {
    this.model.set(this.options.propertyName, this.ui.input.is(':checked'));
  },

  load: function() {
    this.ui.input.attr('checked', this.model.get(this.options.propertyName));
  }
});