pageflow.EditorView = Backbone.View.extend({
  events: {
    'click a': function(event) {
      // prevent default for all links
      if (!$(event.target).attr('target') &&
          !$(event.target).attr('download') &&
          !$(event.target).attr('href')) {
        return false;
      }
    }
  },

  initialize: function() {
    $(window).on('beforeunload', function(event) {
      if (pageflow.entry.get('uploading_files_count') > 0)  {
        return I18n.t('pageflow.editor.views.editor_views.files_pending_warning');
      }
    });
  },

  render: function() {
    this.$el.layout({
      minSize: 300,
      togglerTip_closed: I18n.t('pageflow.editor.views.editor_views.show_editor'),
      togglerTip_open: I18n.t('pageflow.editor.views.editor_views.hide_editor'),
      resizerTip: I18n.t('pageflow.editor.views.editor_views.resize_editor'),
      onresize: function() {
        pageflow.app.trigger('resize');
      }
    });

    new pageflow.UploaderView().render();

    this.$el.append(new pageflow.LockedView({
      model: pageflow.editLock
    }).render().el);

    this.$el.append(new pageflow.HelpView().render().el);
  }
});