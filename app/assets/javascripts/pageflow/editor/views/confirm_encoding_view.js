pageflow.ConfirmEncodingView = Backbone.Marionette.ItemView.extend({
  template: 'templates/confirm_encoding',
  className: 'confirm_encoding',

  ui: {
    blankSlate: '.blank_slate',
    videoFilesPanel: '.video_files_panel',
    audioFilesPanel: '.audio_files_panel',

    summary: '.summary',
    confirmButton: 'button'
  },

  events: {
    'click button': function() {
      this.model.saveAndReset();
    }
  },

  initialize: function() {
    this.confirmableVideoFiles = pageflow.videoFiles.confirmable();
    this.confirmableAudioFiles = pageflow.audioFiles.confirmable();
  },

  onRender: function() {
    this.listenTo(this.model, 'change', this.updateSummary);

    this.listenTo(this.confirmableAudioFiles, 'add remove', this.updateBlankSlate);
    this.listenTo(this.confirmableVideoFiles, 'add remove', this.updateBlankSlate);

    this.ui.videoFilesPanel.append(this.subview(new pageflow.CollectionView({
      tagName: 'ul',
      className: 'confirmable_files',
      collection: this.confirmableVideoFiles,
      itemViewConstructor: pageflow.ConfirmableFileItemView,
      itemViewOptions: {
        selectedFiles: this.model.videoFiles
      }
    })).el);

    this.ui.audioFilesPanel.append(this.subview(new pageflow.CollectionView({
      tagName: 'ul',
      className: 'confirmable_files',
      collection: this.confirmableAudioFiles,
      itemViewConstructor: pageflow.ConfirmableFileItemView,
      itemViewOptions: {
        selectedFiles: this.model.audioFiles
      }
    })).el);

    this.update();
  },

  update: function() {
    this.updateBlankSlate();
    this.updateSummary();
  },

  updateBlankSlate: function() {
    this.ui.blankSlate.toggle(!this.confirmableVideoFiles.length && !this.confirmableAudioFiles.length);
    this.ui.videoFilesPanel.toggle(!!this.confirmableVideoFiles.length);
    this.ui.audioFilesPanel.toggle(!!this.confirmableAudioFiles.length);
  },

  updateSummary: function(enabled) {
    this.ui.summary.html(this.model.get('summary_html'));
    this.ui.confirmButton.toggleClass('checking', !!this.model.get('checking'));

    if (this.model.get('empty') || this.model.get('exceeding') || this.model.get('checking')) {
      this.ui.confirmButton.attr('disabled', true);
    }
    else {
      this.ui.confirmButton.removeAttr('disabled');
    }
  }
});

pageflow.ConfirmEncodingView.create = function(options) {
  return new pageflow.BackButtonDecoratorView({
    view: new pageflow.ConfirmEncodingView(options)
  });
};