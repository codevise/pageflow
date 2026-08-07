import Backbone from 'backbone';
import _ from 'underscore';

import {FileStage} from '../FileStage';
import {SubsetCollection} from '../../collections/SubsetCollection';

export const stageProvider = {
  initialize: function() {
    var finishedStates = [this.readyState];
    var stages = _.result(this, 'stages') || [];

    this.stages = new Backbone.Collection(_.chain(stages).slice().reverse().map(function (options) {
      var name = options.name;

      options.file = this;
      options.finishedStates = finishedStates;

      var fileStage = new FileStage({name: name}, options);
      finishedStates = finishedStates.concat(fileStage.nonFinishedStates);

      return fileStage;
    }, this).reverse().value());

    this.unfinishedStages = new SubsetCollection({
      parent: this.stages,
      watchAttribute: 'finished',

      filter: function(stage) {
        return !stage.get('finished');
      }
    });

    // Only the stage a file is waiting on says anything about what is
    // going on. Stages which are done or still queued behind the
    // current one only add noise.
    this.currentStages = new Backbone.Collection();
    this.listenTo(this.unfinishedStages, 'add remove', this.updateCurrentStages);
    this.updateCurrentStages();
  },

  updateCurrentStages: function() {
    var stage = this.unfinishedStages.first();

    this.currentStages.set(stage ? [stage] : []);
  },

  currentStage: function() {
    return this.stages.find(function(stage) {
      return stage.get('active') || stage.get('action_required') || stage.get('failed');
    });
  }
};
