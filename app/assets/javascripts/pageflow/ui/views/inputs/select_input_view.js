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
        this.options.translationKeys = _.map(this.options.values, function(value) {
          return 'activerecord.values.' + this.model.i18nKey + '.' + this.options.propertyName + '.' + value;
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
  },

  onRender: function() {
    this.appendBlank();
    this.appendPlaceholder();

    _.each(this.options.values, function(value, index) {
      var option = document.createElement('option');
      var group = this.options.groups[index];
      var optgroup = [];

      option.value = value;
      option.text = this.options.texts[index];

      if (group) {
        var escapedGroup = group.replace(/"/g, '&quot;');
        optgroup = this.ui.select.find('optgroup[label="' + escapedGroup + '"]');

        if (optgroup.length > 0) {
          optgroup.append(option);
        }
        else {
          $('<optgroup label="' + escapedGroup + '">')
            .appendTo(this.ui.select)
            .append(option);
        }

        option.setAttribute('data-group', group);
      }
      else {
        this.ui.select.append(option);
      }

    }, this);

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

  save: function() {
    this.model.set(this.options.propertyName, this.ui.select.val());
  },

  load: function() {
    if (!this.isClosed) {
      this.ui.select.val(this.model.get(this.options.propertyName));
    }
  }
});