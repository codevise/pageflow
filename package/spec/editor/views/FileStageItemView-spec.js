import Backbone from 'backbone';

import {FileStage, FileStageItemView} from 'pageflow/editor';

import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('FileStageItemView', () => {
  function stage(state) {
    return new FileStage({name: 'encoding'}, {
      file: new Backbone.Model({state}),
      activeStates: ['encoding'],
      finishedStates: ['encoded'],
      failedStates: ['encoding_failed'],
      actionRequiredStates: ['waiting_for_confirmation']
    });
  }

  it('renders icon for stage', () => {
    const view = new FileStageItemView({model: stage('encoding_failed')});

    render(view);

    expect(view.$el.find('.file_stage_icon-alert')[0].style.display).not.toEqual('none');
  });
});
