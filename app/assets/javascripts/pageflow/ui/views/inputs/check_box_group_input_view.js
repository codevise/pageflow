/**
 * Input view for attributes storing configuration hashes with boolean values.
 *
 * @see {@link module:pageflow/ui.pageflow.inputView pageflow.inputView} for further options
 * @class
 * @memberof module:pageflow/ui
 */
pageflow.CheckBoxGroupInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/ui/templates/inputs/check_box_group_input',
  className: 'check_box_group_input',

  events: {
    'change': 'save'
  },

  ui: {
    label: 'label',
    container: '.check_boxes_container'
  },

  initialize: function() {
    if (!this.options.texts) {
      if (!this.options.translationKeys) {
        var translationKeyPrefix = this.options.translationKeyPrefix ||
          pageflow.i18nUtils.findKeyWithTranslation(this.attributeTranslationKeys('values', {
            fallbackPrefix: 'activerecord.values'
          }));

        this.options.translationKeys = _.map(this.options.values, function(value) {
          return translationKeyPrefix + '.' + value;
        }, this);
      }

      this.options.texts = _.map(this.options.translationKeys, function(key) {
        return I18n.t(key);
      });
    }
  },

  onRender: function() {
    this.ui.label.attr('for', this.cid);
    this.appendOptions();
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  appendOptions: function () {
    _.each(this.options.values, function(value, index) {
      var option = '<div class="check_box">'+
                   '<label><input type="checkbox" name="'+value+'" />'+
                   this.options.texts[index]+'</label></div>';
      this.ui.container.append($(option));
    }, this);
  },

  save: function() {
    var configured = {};
    _.each(this.ui.container.find('input'), function(input) {
      configured[$(input).attr('name')] = $(input).prop('checked');
    });
    this.model.set(this.options.propertyName, configured);
  },

  load: function() {
    if (!this.isClosed) {
      _.each(this.options.values, function(value) {
        this.ui.container
          .find('input[name="'+value+'"]')
          .prop('checked', this.model.get(this.options.propertyName)[value]);
      }, this);
    }
  }
});