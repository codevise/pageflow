pageflow.SliderInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  className: 'slider_input',
  template: 'templates/inputs/slider_input',

  ui: {
    widget: '.slider',
    value: '.value'
  },

  events: {
    'slidechange': 'save'
  },

  onRender: function() {
    this.ui.widget.slider({
      animate: 'fast',
      min: 0,
      max: 100
    });

    this.load();
  },

  save: function() {
    var value = this.ui.widget.slider('option', 'value');
    this.ui.value.text(value + '%');

    this.model.set(this.options.propertyName, value);
  },

  load: function() {
    this.ui.widget.slider('option', 'value', this.model.get(this.options.propertyName));
  }
});