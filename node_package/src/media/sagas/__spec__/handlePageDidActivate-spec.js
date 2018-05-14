import handlePageDidActivate from '../handlePageDidActivate';
import {PREBUFFER, PLAY, actionCreators} from '../../actions';
import {pageDidActivate, pageWillDeactivate} from 'pages/actions';
import backgroundMediaModule from 'backgroundMedia';
import {mute as backgroundMediaMute, unmute as backgroundMediaUnmute} from 'backgroundMedia/actions';

import {delay} from 'redux-saga';

import {expect} from 'support/chai';
import {runSagaInPageScope} from 'support/sagas';
import sinon from 'sinon';

const {prebuffered} = actionCreators();

describe('handlePageDidActivate', () => {
  function initialState(backgroundMedia = {}) {
    return {backgroundMedia};
  }

  it('prebuffers when page did activate', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{canAutoplay: true}]
    })
      .dispatch(pageDidActivate());

    expect(run.put).to.have.been.calledWith(sinon.match({type: PREBUFFER}));
  });

  it('plays video once it is prebuffered', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{canAutoplay: true}]
    })
      .stubCall(delay)
      .dispatch(pageDidActivate())
      .dispatch(prebuffered());

    expect(run.put).to.have.been.calledWith(sinon.match({type: PLAY}));
  });

  it('does not play video once prebuffered if autoplay is false', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{canAutoplay: true}],
      page: {attributes: {autoplay: false}}
    })
      .stubCall(delay)
      .dispatch(pageDidActivate())
      .dispatch(prebuffered());

    expect(run.put).not.to.have.been.calledWith(sinon.match({type: PLAY}));
  });

  it('does not play video once prebuffered if background media muted', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{canAutoplay: true}]
    })
      .stubCall(delay)
      .dispatch(backgroundMediaMute())
      .dispatch(pageDidActivate())
      .dispatch(prebuffered());

    expect(run.put).not.to.have.been.calledWith(sinon.match({type: PLAY}));
  });

  it('supports option to play even if background media muted', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{
        autoplayWhenBackgroundMediaMuted: true,
        canAutoplay: true
      }]
    })
      .stubCall(delay)
      .dispatch(backgroundMediaMute())
      .dispatch(pageDidActivate())
      .dispatch(prebuffered());

    expect(run.put).to.have.been.calledWith(sinon.match({type: PLAY}));
  });

  it('does not play video if page is deactivated while prebuffering', () => {
    const run = runSagaInPageScope(handlePageDidActivate, {
      reduxModules: [backgroundMediaModule],
      args: [{canAutoplay: true}]
    })
      .stubCall(delay)
      .dispatch(pageDidActivate())
      .dispatch(pageWillDeactivate())
      .dispatch(prebuffered());

    expect(run.put).not.to.have.been.calledWith(sinon.match({type: PLAY}));
  });
});
