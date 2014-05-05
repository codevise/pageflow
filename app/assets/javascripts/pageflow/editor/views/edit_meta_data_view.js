/*global editor*/

pageflow.EditMetaDataView = Backbone.Marionette.ItemView.extend({
  template: 'templates/edit_meta_data',
  className: 'edit_meta_data',

  mixins: [pageflow.failureIndicatingView],

  ui: {
    form: '.form_fields'
  },

  events: {
    'click a.back': 'goBack'
  },

  onRender: function() {
    this.ui.form.append(this.subview(new pageflow.TextInputView({
      model: this.model,
      propertyName: 'title'
    })).el);

    this.ui.form.append(this.subview(new pageflow.TextAreaInputView({
      model: this.model,
      propertyName: 'summary'
    })).el);

    this.ui.form.append(this.subview(new pageflow.TextAreaInputView({
      model: this.model,
      propertyName: 'credits'
    })).el);

    this.ui.form.append(this.subview(new pageflow.CheckBoxInputView({
      model: this.model,
      propertyName: 'manual_start'
    })).el);
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});