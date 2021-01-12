import {cookieNotice, readyDeferred} from 'pageflow-paged/frontend';
import {events} from 'pageflow/frontend';
import sinon from 'sinon';

describe('cookieNotice.request', function() {
  it('triggers cookie notice request when ready', function() {
    var callback = sinon.spy();
    events.on('cookie_notice:request', () => callback());

    cookieNotice.request();
    expect(callback).not.toHaveBeenCalled();

    readyDeferred.resolve();
    expect(callback).toHaveBeenCalled();
  });
});
