pageflow.SelectInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/ui/templates/inputs/select_input',

  events: {
    'change': 'save'
  },

  ui: {
    select: 'select'
  },

  initialize: function() {
    if (this.options.collection) {
      this.options.values = _.pluck(this.options.collection, this.options.valueProperty);

      if (this.options.textProperty) {
        this.options.texts = _.pluck(this.options.collection, this.options.textProperty);
      }
      else if (this.options.translationKeyProperty) {
        this.options.translationKeys = _.pluck(this.options.collection, this.options.translationKeyProperty);
      }
    }

    if (!this.options.texts) {
      if (!this.options.translationKeys) {
        this.options.translationKeys = _.map(this.options.values, function(value) {
          return 'activerecord.values.' + this.model.i18nKey + '.' + this.options.propertyName + '.' + value;
        }, this);
      }

      this.options.texts = _.map(this.options.translationKeys, function(key) {
        return I18n.t(key);
      });
    }
  },

  onRender: function() {
    _.each(this.options.values, function(value, index) {
      var option = document.createElement('option');

      option.value = value;
      option.text = this.options.texts[index];

      this.ui.select.append(option);
    }, this);

    this.load();

    if (this.options.ensureValueDefined && !this.ui.select.val()) {
      this.ui.select.val(this.options.values[0]);
      this.save();
    }
  },

  save: function() {
    this.model.set(this.options.propertyName, this.ui.select.val());
  },

  load: function() {
    this.ui.select.val(this.model.get(this.options.propertyName));
  }
});