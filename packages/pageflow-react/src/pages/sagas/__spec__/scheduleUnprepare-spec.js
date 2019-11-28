import scheduleUnprepare from '../scheduleUnprepare';
import {pageScheduleUnprepare, pageDidPrepare, PAGE_DID_UNPREPARE} from '../../actions';

import {delay} from 'redux-saga';

import sinon from 'sinon';
import {runSagaInPageScope} from 'support/sagas';

describe('scheduleUnprepare', () => {
  it('puts unprepare action after delay on schedule unprepare action', () => {
    const run = runSagaInPageScope(scheduleUnprepare)
      .blockOnCall(delay)
      .dispatch(pageScheduleUnprepare())
      .returnFromCall(delay);

    expect(run.put).toHaveBeenCalledWith(sinon.match({type: PAGE_DID_UNPREPARE}));
  });

  it(
    'does not put unprepare if page is prepared again before delay elapses',
    () => {
      const run = runSagaInPageScope(scheduleUnprepare)
        .blockOnCall(delay)
        .dispatch(pageScheduleUnprepare())
        .dispatch(pageDidPrepare())
        .returnFromCall(delay);

      expect(run.put).not.toHaveBeenCalledWith(sinon.match({type: PAGE_DID_UNPREPARE}));
    }
  );
});
