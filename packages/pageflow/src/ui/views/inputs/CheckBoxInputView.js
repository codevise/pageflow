/**
 * Input view for boolean values.
 *
 * @param {boolean} [options.displayUncheckedIfDisabled=false]
 *   Ignore the attribute value if the input is disabled and display
 *   an unchecked check box.
 *
 * @see {@link module:pageflow/ui.pageflow.inputView pageflow.inputView} for further options
 * @class
 * @memberof module:pageflow/ui
 */
pageflow.CheckBoxInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/ui/templates/inputs/check_box',
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
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  save: function() {
    if (!this.options.disabled) {
      this.model.set(this.options.propertyName, this.ui.input.is(':checked'));
    }
  },

  load: function() {
    if (!this.isClosed) {
      this.ui.input.prop('checked', this.displayValue());
    }
  },

  displayValue: function() {
    if (this.options.disabled && this.options.displayUncheckedIfDisabled) {
      return false;
    }
    else {
      return this.model.get(this.options.propertyName);
    }
  }
});
