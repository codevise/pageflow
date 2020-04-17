import Backbone from 'backbone';
import I18n from 'i18n-js';

export const FileStage = Backbone.Model.extend({
  initialize: function(attributes,  options) {
    this.file = options.file;

    this.activeStates = options.activeStates || [];
    this.finishedStates = options.finishedStates || [];
    this.failedStates = options.failedStates || [];
    this.actionRequiredStates = options.actionRequiredStates || [];

    this.nonFinishedStates = this.activeStates.concat(this.failedStates, this.actionRequiredStates);

    this.update();
    this.listenTo(this.file, 'change:state', this.update);
    this.listenTo(this.file, 'change:' + this.get('name') + '_progress', this.update);
    this.listenTo(this.file, 'change:' + this.get('name') + '_error_message', this.update);
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
    this.set('action_required', this.actionRequiredStates.indexOf(state) >= 0);

    if (this.get('active')) {
      this.set('state', 'active');
    }
    else if (this.get('finished')) {
      this.set('state', 'finished');
    }
    else if (this.get('failed')) {
      this.set('state', 'failed');
    }
    else if (this.get('action_required')) {
      this.set('state', 'action_required');
    }
    else {
      this.set('state', 'pending');
    }
  },

  updateProgress: function() {
    this.set('progress', this.file.get(this.get('name') + '_progress'));
  },

  updateErrorMessage: function() {
    var errorMessageAttribute = this.get('name') + '_error_message';
    this.set('error_message', this.file.get(errorMessageAttribute));
  },

  localizedDescription: function() {
    var prefix = 'pageflow.editor.files.stages.';
    var suffix = this.get('name') + '.' + this.get('state');

    return I18n.t(prefix + this.file.i18nKey + '.' + suffix, {
      defaultValue: I18n.t(prefix + suffix)
    });
  }
});