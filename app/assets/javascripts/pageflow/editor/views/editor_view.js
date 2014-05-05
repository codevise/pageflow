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
        return 'Es werden noch Dateien hochgeladen. Wenn Sie die Seite verlassen werden die Uploads abgebrochen.';
      }
    });
  },

  render: function() {
    this.$el.layout({
      minSize: 300,
      togglerTip_closed: 'Editorleiste einblenden',
      togglerTip_open: 'Editorleiste ausblenden',
      resizerTip: 'Größe der Editorleiste ändern',
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