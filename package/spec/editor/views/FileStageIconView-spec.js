import Backbone from 'backbone';

import {FileStage, FileStageIconView} from 'pageflow/editor';

import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('FileStageIconView', () => {
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
      var element = view.$el.find('.file_stage_icon-' + name)[0];

      return !!element && element.style.display !== 'none';
    }

    return {
      spinner: shown('spinner'),
      alert: shown('alert'),
      bell: shown('bell')
    };
  }

  it('shows spinner while stage is active', () => {
    const view = new FileStageIconView({model: stage('encoding')});

    render(view);

    expect(icons(view)).toEqual({spinner: true, alert: false, bell: false});
  });

  it('shows spinner while stage is pending', () => {
    const view = new FileStageIconView({model: stage('uploading')});

    render(view);

    expect(icons(view)).toEqual({spinner: true, alert: false, bell: false});
  });

  it('shows alert icon when stage failed', () => {
    const view = new FileStageIconView({model: stage('encoding_failed')});

    render(view);

    expect(icons(view)).toEqual({spinner: false, alert: true, bell: false});
  });

  it('shows bell icon when stage requires action', () => {
    const view = new FileStageIconView({model: stage('waiting_for_confirmation')});

    render(view);

    expect(icons(view)).toEqual({spinner: false, alert: false, bell: true});
  });

  it('updates icon when state changes', () => {
    const model = stage('encoding');
    const view = new FileStageIconView({model});

    render(view);
    model.file.set('state', 'encoding_failed');

    expect(icons(view)).toEqual({spinner: false, alert: true, bell: false});
  });

  it('hides icon from screen readers', () => {
    const view = new FileStageIconView({model: stage('encoding')});

    render(view);

    expect(view.el.getAttribute('aria-hidden')).toEqual('true');
  });
});
