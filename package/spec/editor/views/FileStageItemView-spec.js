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

  function icons(view) {
    function shown(name) {
      var element = view.$el.find('.file_stage_item-' + name)[0];

      return !!element && element.style.display !== 'none';
    }

    return {
      spinner: shown('spinner'),
      alert: shown('alert'),
      bell: shown('bell')
    };
  }

  it('shows spinner while stage is active', () => {
    const view = new FileStageItemView({model: stage('encoding')});

    render(view);

    expect(icons(view)).toEqual({spinner: true, alert: false, bell: false});
  });

  it('shows spinner while stage is pending', () => {
    const view = new FileStageItemView({model: stage('uploading')});

    render(view);

    expect(icons(view)).toEqual({spinner: true, alert: false, bell: false});
  });

  it('shows alert icon when stage failed', () => {
    const view = new FileStageItemView({model: stage('encoding_failed')});

    render(view);

    expect(icons(view)).toEqual({spinner: false, alert: true, bell: false});
  });

  it('shows bell icon when stage requires action', () => {
    const view = new FileStageItemView({model: stage('waiting_for_confirmation')});

    render(view);

    expect(icons(view)).toEqual({spinner: false, alert: false, bell: true});
  });

  it('updates icon when state changes', () => {
    const model = stage('encoding');
    const view = new FileStageItemView({model});

    render(view);
    model.file.set('state', 'encoding_failed');

    expect(icons(view)).toEqual({spinner: false, alert: true, bell: false});
  });
});
