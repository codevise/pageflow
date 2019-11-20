import fadeInWhenPageWillActivate from '../fadeInWhenPageWillActivate';
import {PREBUFFER, PLAY, CHANGE_VOLUME_FACTOR, actionCreators} from '../../actions';
import {pageWillActivate, pageDidActivate, pageWillDeactivate} from 'pages/actions';
import backgroundMediaModule from 'backgroundMedia';

import {delay} from 'redux-saga';

import {runSagaInPageScope} from 'support/sagas';
import sinon from 'sinon';

const {prebuffered} = actionCreators();

describe('fadeInWhenPageWillActivate', () => {
  it('prebuffers when page will activate', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .dispatch(pageWillActivate());

    expect(run.put).to.have.been.calledWith(action(PREBUFFER));
  });

  it('does not play video before it is prebuffered', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .dispatch(pageWillActivate());

    expect(run.put).not.to.have.been.calledWith(action(PLAY));
  });

  it('plays video silently once it is prebuffered', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .stubCall(delay)
      .dispatch(pageWillActivate())
      .dispatch(prebuffered());

    expect(run.put).to.have.been.calledWith(action(CHANGE_VOLUME_FACTOR, {volumeFactor: 0}));
    expect(run.put).to.have.been.calledWith(action(PLAY));
  });

  it(
    'does not play video if page is deactivated before video is prebuffered',
    () => {
      const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
        reduxModules: [backgroundMediaModule]
      })
        .dispatch(pageWillActivate())
        .dispatch(pageWillDeactivate())
        .dispatch(prebuffered());

      expect(run.put).not.to.have.been.calledWith(action(PLAY));
    }
  );

  it('does not turn up volume before video is prebuffered', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .dispatch(pageWillActivate());

    expect(run.put).not.to.have.been.calledWith(action(CHANGE_VOLUME_FACTOR, {volumeFactor: 1}));
  });

  it('does not turn up volume before page did activate', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .dispatch(prebuffered());

    expect(run.put).not.to.have.been.calledWith(action(CHANGE_VOLUME_FACTOR, {volumeFactor: 1}));
  });

  it('turns up volume when video is prebuffered and page did acticate', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .stubCall(delay)
      .dispatch(pageWillActivate())
      .dispatch(prebuffered())
      .dispatch(pageDidActivate());

    expect(run.put).to.have.been.calledWith(action(CHANGE_VOLUME_FACTOR, {volumeFactor: 1}));
  });

  it('does not turn up volume when page is deactivated again', () => {
    const run = runSagaInPageScope(fadeInWhenPageWillActivate, {
      reduxModules: [backgroundMediaModule]
    })
      .stubCall(delay)
      .dispatch(pageWillActivate())
      .dispatch(pageDidActivate())
      .dispatch(pageWillDeactivate())
      .dispatch(prebuffered());

    expect(run.put).not.to.have.been.calledWith(action(CHANGE_VOLUME_FACTOR, {volumeFactor: 1}));
  });

  function action(type, payload = {}) {
    return sinon.match({type, payload});
  }
});
