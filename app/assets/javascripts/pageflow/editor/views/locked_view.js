pageflow.LockedView = Backbone.Marionette.ItemView.extend({
  template: 'templates/locked',
  className: 'locked checking',

  ui: {
    breakButton: '.break',
    message: '.error .message'
  },

  events: {
    'click .close': 'goBack',

    'click .break': 'breakLock'
  },

  modelEvents: {
    acquired: 'hide',

    locked: 'show',

    unauthenticated: 'goBack'
  },

  breakLock: function() {
    this.model.acquire({force: true});
  },

  goBack: function() {
    window.location = "/admin/entries/" + pageflow.entry.id;
  },

  show: function(info, options) {
    var key = info.error + '.' + options.context;

    this.ui.message.html(I18n.t('pageflow.edit_locks.errors.' + key + '_html', {user_name: info.held_by}));
    this.ui.message.attr('data-error', key);

    this.ui.breakButton.text(I18n.t('pageflow.edit_locks.break_action.acquire'));

    this.$el.removeClass('checking');
    this.$el.show();
  },

  hide: function() {
    this.ui.message.attr('data-error', null);

    this.$el.removeClass('checking');
    this.$el.hide();
  }
});