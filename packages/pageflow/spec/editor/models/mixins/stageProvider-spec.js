describe('stageProvider', function() {
  var Model = Backbone.Model.extend({
    mixins: [pageflow.stageProvider],

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

  it('rewrites #stages to FileStage collection', function() {
    var model = new Model();

    expect(model.stages.at(0).get('name')).to.eq('uploading');
    expect(model.stages.at(1).get('name')).to.eq('checking');
    expect(model.stages.at(2).get('name')).to.eq('processing');
  });

  it('sets finished states to union states of following stages and readyState', function() {
    var model = new Model();

    expect(model.stages.at(0).finishedStates).to.deep.eq(['finished', 'process_running', 'process_failed', 'check_running', 'check_failed', 'check_unconfirmed']);
    expect(model.stages.at(1).finishedStates).to.deep.eq(['finished', 'process_running', 'process_failed']);
    expect(model.stages.at(2).finishedStates).to.deep.eq(['finished']);
  });

  it('provides subset collection of unfinished stages', function() {
    var model = new Model({
      state: 'check_running'
    });

    expect(model.unfinishedStages.pluck('name')).to.deep.eq(['checking', 'processing']);
  });

  it('#stages can be function', function() {
    var model = new (Backbone.Model.extend({
      mixins: [pageflow.stageProvider],

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

    expect(model.stages.at(0).get('name')).to.eq('uploading');
  });
});