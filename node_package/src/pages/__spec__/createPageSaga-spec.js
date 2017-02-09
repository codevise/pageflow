import createPageSaga from '../createPageSaga';
import {enhance, cleanup} from '../actions';

import {call, take} from 'redux-saga/effects';

import {expect} from 'support/chai';
import sinon from 'sinon';
import {runSagaInPageScope} from 'support/sagas';

describe('createPageSaga', () => {
  describe('creates saga that', () => {
    it('does not run page type saga automatically', () => {
      const spy = sinon.spy();
      const videoPageTypeSaga = function*() { yield call(spy); };
      const pageSaga = createPageSaga({pageTypeSagas: {video: videoPageTypeSaga}});

      runSagaInPageScope(pageSaga, {
        page: {attributes: {type: 'video'}}
      });

      expect(spy).not.to.have.been.called;
    });

    it('runs page type saga on enhance', () => {
      const spy = sinon.spy();
      const videoPageTypeSaga = function*() { yield call(spy); };
      const pageSaga = createPageSaga({pageTypeSagas: {video: videoPageTypeSaga}});

      runSagaInPageScope(pageSaga, {
        page: {attributes: {type: 'video'}}
      })
        .dispatch(enhance());

      expect(spy).to.have.been.called;
    });

    it('cancels page type saga on cleanup', () => {
      const spy = sinon.spy();
      const videoPageTypeSaga = function*() {
        try {
          yield take('WILL_NEVER_HAPPEN');
        }
        finally {
          spy();
        }
      };
      const pageSaga = createPageSaga({pageTypeSagas: {video: videoPageTypeSaga}});

      runSagaInPageScope(pageSaga, {
        page: {attributes: {type: 'video'}}
      })
        .dispatch(enhance())
        .dispatch(cleanup());

      expect(spy).to.have.been.called;
    });
  });
});
