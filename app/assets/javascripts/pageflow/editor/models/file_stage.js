pageflow.FileStage = Backbone.Model.extend({
  initialize: function(attributes,  options) {
    this.file = options.file;

    this.activeStates = options.activeStates;
    this.finishedStates = options.finishedStates;
    this.failedStates = options.failedStates;

    this.update();
    this.listenTo(this.file, 'change:state', this.update);
    this.listenTo(this.file, 'change:encoding_progress', this.update);
    this.listenTo(this.file, 'change:uploading_progress', this.update);
  },

  update: function() {
    this.updateState();
    this.updateProgress();
    this.updateErrorMessage();
  },

  updateState: function() {
    var state = this.file.get('state');

    this.set('active', this.activeStates.indexOf(state) >= 0);
    this.set('finished', this.finishedStates.indexOf(state) >= 0);
    this.set('failed', this.failedStates.indexOf(state) >= 0);

    if (this.get('active')) {
      this.set('state', 'active');
    }
    else if (this.get('finished')) {
      this.set('state', 'finished');
    }
    else if (this.get('failed')) {
      this.set('state', 'failed');
    }
    else {
      this.set('state', 'pending');
    }
  },

  updateProgress: function() {
    this.set('progress', this.file.get(this.get('name') + '_progress'));
  },

  updateErrorMessage: function() {
    var errorMessageAttribute = this.get('name').replace('_failed', '') + '_error_message';
    this.set('error_message', this.file.get(errorMessageAttribute));
  },

  localizedDescription: function() {
    return I18n.t('editor.files.stages.' + this.get('name') + '.' + this.get('state'));
  }
});