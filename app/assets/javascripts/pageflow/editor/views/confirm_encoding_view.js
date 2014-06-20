pageflow.ConfirmEncodingView = Backbone.Marionette.ItemView.extend({
  template: 'templates/confirm_encoding',

  ui: {
    blankSlate: '.blank_slate',
    videoFilesPanel: '.video_files_panel',
    audioFilesPanel: '.audio_files_panel',
    confirmButton: 'button'
  },

  events: {
    'click button': function() {
      this.model.save();
    }
  },

  initialize: function() {
    this.confirmableVideoFiles = pageflow.videoFiles.confirmable();
    this.confirmableAudioFiles = pageflow.audioFiles.confirmable();
  },

  onRender: function() {
    this.listenTo(this.model, 'change:empty', this.updateConfirmButton);

    this.listenTo(this.confirmableAudioFiles, 'add remove', this.update);
    this.listenTo(this.confirmableVideoFiles, 'add remove', this.update);

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
    this.ui.blankSlate.toggle(!this.confirmableVideoFiles.length && !this.confirmableAudioFiles.length);
    this.ui.videoFilesPanel.toggle(!!this.confirmableVideoFiles.length);
    this.ui.audioFilesPanel.toggle(!!this.confirmableAudioFiles.length);

    this.updateConfirmButton();
  },

  updateConfirmButton: function(enabled) {
    if (this.model.get('empty')) {
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