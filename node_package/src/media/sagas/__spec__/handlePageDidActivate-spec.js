import handlePageDidActivate from '../handlePageDidActivate';
import {PREBUFFER, PLAY, actionCreators} from '../../actions';
import {pageDidActivate, pageWillDeactivate} from 'pages/actions';

import {delay} from 'redux-saga';

import {expect} from 'support/chai';
import {runSagaInPageScope} from 'support/sagas';
import sinon from 'sinon';

const {prebuffered} = actionCreators();

describe('handlePageDidActivate', () => {
  it('prebuffers when page did activate', () => {
    const run = runSagaInPageScope(handlePageDidActivate)
      .dispatch(pageDidActivate());

    expect(run.put).to.have.been.calledWith(sinon.match({type: PREBUFFER}));
  });

  it('plays video once it is prebuffered', () => {
    const run = runSagaInPageScope(handlePageDidActivate)
      .stubCall(delay)
      .dispatch(pageDidActivate())
      .dispatch(prebuffered());

    expect(run.put).to.have.been.calledWith(sinon.match({type: PLAY}));
  });

  it('does not play video once prebuffered if autoplay is false', () => {
    const run = runSagaInPageScope(handlePageDidActivate,
                                   {page: {attributes: {autoplay: false}}})
      .stubCall(delay)
      .dispatch(pageDidActivate())
      .dispatch(prebuffered());

    expect(run.put).not.to.have.been.calledWith(sinon.match({type: PLAY}));
  });

  it('does not play video if page is deactivated while prebuffering', () => {
    const run = runSagaInPageScope(handlePageDidActivate)
      .stubCall(delay)
      .dispatch(pageDidActivate())
      .dispatch(pageWillDeactivate())
      .dispatch(prebuffered());

    expect(run.put).not.to.have.been.calledWith(sinon.match({type: PLAY}));
  });
});
