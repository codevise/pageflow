import Backbone from 'backbone';

import {stageProvider} from 'pageflow/editor';

describe('stageProvider', () => {
  var Model = Backbone.Model.extend({
    mixins: [stageProvider],

    readyState: 'finished',

    stages: [
      {
        name: 'uploading',
        activeStates: ['upload_running'],
        failedStates: ['uploading_failed']
      },
      {
        name: 'checking',
        activeStates: ['check_running'],
        failedStates: ['check_failed'],
        actionRequiredStates: ['check_unconfirmed']
      },
      {
        name: 'processing',
        activeStates: ['process_running'],
        failedStates: ['process_failed']
      }
    ]
  });

  it('rewrites #stages to FileStage collection', () => {
    var model = new Model();

    expect(model.stages.at(0).get('name')).toBe('uploading');
    expect(model.stages.at(1).get('name')).toBe('checking');
    expect(model.stages.at(2).get('name')).toBe('processing');
  });

  it(
    'sets finished states to union states of following stages and readyState',
    () => {
      var model = new Model();

      expect(model.stages.at(0).finishedStates).toEqual(
        ['finished', 'process_running', 'process_failed', 'check_running', 'check_failed', 'check_unconfirmed']
      );
      expect(model.stages.at(1).finishedStates).toEqual(['finished', 'process_running', 'process_failed']);
      expect(model.stages.at(2).finishedStates).toEqual(['finished']);
    }
  );

  it('provides subset collection of unfinished stages', () => {
    var model = new Model({
      state: 'check_running'
    });

    expect(model.unfinishedStages.pluck('name')).toEqual(['checking', 'processing']);
  });

  describe('current stages', () => {
    it('contains only the first unfinished stage', () => {
      var model = new Model({state: 'check_running'});

      expect(model.currentStages.pluck('name')).toEqual(['checking']);
    });

    it('moves on once the stage is finished', () => {
      var model = new Model({state: 'check_running'});

      model.set('state', 'process_running');

      expect(model.currentStages.pluck('name')).toEqual(['processing']);
    });

    it('is empty once the file is ready', () => {
      var model = new Model({state: 'finished'});

      expect(model.currentStages.length).toBe(0);
    });

    it('keeps the same model while the stage does not change', () => {
      var model = new Model({state: 'check_running'});
      var stage = model.currentStages.first();

      model.set('state', 'check_unconfirmed');

      expect(model.currentStages.first()).toBe(stage);
    });
  });

  it('#stages can be function', () => {
    var model = new (Backbone.Model.extend({
      mixins: [stageProvider],

      readyState: 'finished',

      stages: function() {
        return [
          {
            name: 'uploading',
            activeStates: ['upload_running'],
            failedStates: ['uploading_failed']
          }
        ];
      }
    }))();

    expect(model.stages.at(0).get('name')).toBe('uploading');
  });
});