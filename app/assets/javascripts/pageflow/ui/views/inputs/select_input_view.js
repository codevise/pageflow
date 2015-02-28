pageflow.SelectInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/ui/templates/inputs/select_input',

  events: {
    'change': 'save'
  },

  ui: {
    select: 'select',
    input: 'select'
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

      if (this.options.groupProperty) {
        this.options.groups = _.pluck(this.options.collection, this.options.groupProperty);
      }
      else if (this.options.groupTranslationKeyProperty) {
        this.options.groupTanslationKeys = _.pluck(this.options.collection, this.options.groupTranslationKeyProperty);
      }
    }

    if (!this.options.texts) {
      if (!this.options.translationKeys) {
        var translationKeyPrefix = this.options.translationKeyPrefix || 'activerecord.values.' + this.model.i18nKey + '.' + this.options.propertyName;

        this.options.translationKeys = _.map(this.options.values, function(value) {
          return translationKeyPrefix + '.' + value;
        }, this);
      }

      this.options.texts = _.map(this.options.translationKeys, function(key) {
        return I18n.t(key);
      });
    }

    if (!this.options.groups) {
      this.options.groups = _.map(this.options.groupTanslationKeys, function(key) {
        return I18n.t(key);
      });
    }

    this.optGroups = {};
  },

  onRender: function() {
    this.appendBlank();
    this.appendPlaceholder();
    this.appendOptions();

    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);

    if (this.options.ensureValueDefined && !this.ui.select.val()) {
      this.ui.select.val(this.options.values[0]);
      this.save();
    }
  },

  appendBlank: function() {
    if (!this.options.includeBlank) {
      return;
    }

    if (this.options.blankTranslationKey) {
      this.options.blankText = I18n.t(this.options.blankTranslationKey);
    }

    var option = document.createElement('option');

    option.value = '';
    option.text = this.options.blankText || I18n.t('pageflow.ui.views.inputs.select_input_view.none');

    this.ui.select.append(option);
  },

  appendPlaceholder: function() {
    if (!this.options.placeholderModel && !this.options.placeholderValue) {
      return;
    }

    var placeholderValue = this.options.placeholderValue || this.options.placeholderModel.get(this.options.propertyName);
    var placeholderIndex = this.options.values.indexOf(placeholderValue);

    if (placeholderIndex >= 0) {
      var option = document.createElement('option');

      option.value = '';
      option.text = I18n.t('pageflow.ui.views.inputs.select_input_view.placeholder', {text: this.options.texts[placeholderIndex]});

      this.ui.select.append(option);
    }
  },

  appendOptions: function() {
    _.each(this.options.values, function(value, index) {
      var option = document.createElement('option');
      var group = this.options.groups[index];

      option.value = value;
      option.text = this.options.texts[index];

      if (group) {
        option.setAttribute('data-group', group);
        this.findOrCreateOptGroup(group).append(option);
      }
      else {
        this.ui.select.append(option);
      }
    }, this);
  },

  findOrCreateOptGroup: function(label) {
    if (!this.optGroups[label]) {
      this.optGroups[label] = $('<optgroup />', {label: label})
        .appendTo(this.ui.select);
    }

    return this.optGroups[label];
  },

  save: function() {
    this.model.set(this.options.propertyName, this.ui.select.val());
  },

  load: function() {
    if (!this.isClosed) {
      this.ui.select.val(this.model.get(this.options.propertyName));
    }
  }
});