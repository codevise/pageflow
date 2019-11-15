pageflow.EntryPublicationQuotaDecoratorView = Backbone.Marionette.Layout.extend({
  template: 'templates/entry_publication_quota_decorator',
  className: 'quota_decorator',

  regions: {
    outlet: '.outlet'
  },

  ui: {
    state: '.quota_state',
    exhaustedMessage: '.exhausted_message'
  },

  modelEvents: {
    'change:exceeding change:checking change:quota': 'update'
  },

  onRender: function() {
    this.model.check();
  },

  update: function() {
    var view = this;

    if (this.model.get('checking')) {
      view.ui.state.text(I18n.t('pageflow.editor.quotas.loading'));
      view.ui.exhaustedMessage.hide().html('');
      view.outlet.close();
    }
    else {
      if (view.model.get('exceeding')) {
        view.ui.state.hide();
        view.ui.exhaustedMessage.show().html(view.model.get('exhausted_html'));
        view.outlet.close();
      }
      else {
        if (view.model.quota().get('state_description')) {
          view.ui.state.text(view.model.quota().get('state_description'));
          view.ui.state.show();
        }
        else {
          view.ui.state.hide();
        }

        view.outlet.show(view.options.view);
      }
    }
  }
});