pageflow.QuotaDecoratorView = Backbone.Marionette.Layout.extend({
  template: 'templates/quota_decorator',
  className: 'quota_decorator',

  regions: {
    outlet: '.outlet'
  },

  ui: {
    state: '.quota_state',
    exceededMessage: '.exceeded_message'
  },

  onRender: function() {
    var view = this;

    view.ui.state.text(I18n.t('editor.quotas.loading'));
    view.ui.exceededMessage.html('');
    view.outlet.close();

    view.model.fetch({
      success: function() {
        if (view.model.isExceeded()) {
          view.ui.state.hide();
          view.ui.exceededMessage.html(view.model.get('exceeded_html'));
        }
        else {
          if (view.model.get('state_description')) {
            view.ui.state.text(view.model.get('state_description'));
            view.ui.state.show();
          }
          else {
            view.ui.state.hide();
          }

          view.outlet.show(view.options.view);
        }
      },

      error: function() {
        view.ui.state.text(I18n.t('editor.quota.error'));
      }
    });
  }
});