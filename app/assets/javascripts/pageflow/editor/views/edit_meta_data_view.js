/*global editor*/

pageflow.EditMetaDataView = Backbone.Marionette.Layout.extend({
  template: 'templates/edit_meta_data',
  className: 'edit_meta_data',

  mixins: [pageflow.failureIndicatingView],

  regions: {
    formContainer: '.form_fields'
  },

  events: {
    'click a.back': 'goBack'
  },

  onRender: function() {
    var configurationEditor = new pageflow.ConfigurationEditorView({
      model: this.model
    });

    configurationEditor.tab('general', function() {
      this.input('title', pageflow.TextInputView);
      this.input('summary', pageflow.TextAreaInputView);
      this.input('credits', pageflow.TextAreaInputView);
    });

    configurationEditor.tab('widgets', function() {
      this.input('manual_start', pageflow.CheckBoxInputView);
      this.input('home_button_enabled', pageflow.CheckBoxInputView, {
        disabled: !pageflow.theming.hasHomeButton(),
        displayUncheckedIfDisabled: true
      });
      if (pageflow.theming.hasHomeButton()) {
        this.input('home_url', pageflow.TextInputView, {
          placeholder: pageflow.theming.get('pretty_url'),
          visibleBinding: 'home_button_enabled'
        });
      }
    });

    this.formContainer.show(configurationEditor);
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});