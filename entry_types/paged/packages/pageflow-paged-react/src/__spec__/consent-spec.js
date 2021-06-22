import consent from 'consent';
import {isConsentUIVisible} from 'consent/selectors';
import {acceptAll, denyAll} from 'consent/actions';
import createStore from 'createStore';

import sinon from 'sinon';
import {flushPromises} from 'support/flushPromises';

describe('consent', () => {
  function setup() {
    const consentEagerlyRequestedFrom = [];
    let resolve;
    const promise = new Promise((r) => resolve = r);
    const consentApi = {
      require: async function(vendorName) {
        consentEagerlyRequestedFrom.push(vendorName);
        resolve();
      },
      requested: async function() {
        await promise;
        const acceptAll = jest.fn();
        const denyAll = jest.fn();

        this.mostRecentlyReturnedAcceptAll = acceptAll;
        this.mostRecentlyReturnedDenyAll = denyAll;

        return {
          acceptAll,
          denyAll
        };
      }
    };
    const widgetsApi = fakeWidgetsApi();

    const store = createStore([consent], {widgetsApi, consent: consentApi});

    return {
      dispatch: store.dispatch.bind(store),

      select(selector) {
        return selector(store.getState());
      },

      widgetsApi,
      consentApi
    };
  }

  function fakeWidgetsApi() {
    const resetCallback = sinon.spy();

    return {
      resetCallback,
      use: sinon.stub().yields(resetCallback)
    };
  }

  async function eagerlyRequireConsentElsewhere(consentApi) {
    // in real use cases, some embed or analytics code elsewhere in
    // the codebase might use the eager require API like this
    await consentApi.require('elsewhere');
  }

  it('is invisible by default', async () => {
    const {select} = setup();

    await flushPromises();
    const result = select(isConsentUIVisible);

    expect(result).toBe(false);
  });

  it('becomes visible if consent is eagerly required', async () => {
    const {consentApi, select} = setup();
    await eagerlyRequireConsentElsewhere(consentApi);

    const result = select(isConsentUIVisible);

    expect(result).toBe(true);
  });

  it('is hidden on accept all', async () => {
    const {select, consentApi, dispatch} = setup();

    await eagerlyRequireConsentElsewhere(consentApi);
    dispatch(acceptAll());
    const result = select(isConsentUIVisible);

    expect(result).toBe(false);
  });

  it('is hidden on deny all', async () => {
    const {select, consentApi, dispatch} = setup();

    await eagerlyRequireConsentElsewhere(consentApi);
    dispatch(denyAll());
    const result = select(isConsentUIVisible);

    expect(result).toBe(false);
  });

  it('calls `acceptAll` returned by `required` on `acceptAll` action', async () => {
    const {consentApi, dispatch} = setup();

    await eagerlyRequireConsentElsewhere(consentApi);
    dispatch(acceptAll());

    expect(consentApi.mostRecentlyReturnedAcceptAll).toHaveBeenCalled();
  });

  it('calls `denyAll` returned by `required` on `denyAll` action', async () => {
    const {consentApi, dispatch} = setup();

    await eagerlyRequireConsentElsewhere(consentApi);
    dispatch(denyAll());

    expect(consentApi.mostRecentlyReturnedDenyAll).toHaveBeenCalled();
  });

  it('does not use consent_bar_visible widget before eagerly requiring consent', async () => {
    const {widgetsApi} = setup();

    await flushPromises();

    expect(widgetsApi.use).not.toHaveBeenCalledWith({
      name: 'consent_bar_visible',
      insteadOf: 'consent_bar'
    });
  });

  it('uses consent_bar_visible widget when it becomes visible', async () => {
    const {consentApi, widgetsApi} = setup();

    await eagerlyRequireConsentElsewhere(consentApi);

    expect(widgetsApi.use).toHaveBeenCalledWith({
      name: 'consent_bar_visible',
      insteadOf: 'consent_bar'
    });
  });

  it('resets consent_bar_visible widget once accepted', async () => {
    const {dispatch, consentApi, widgetsApi} = setup();

    await eagerlyRequireConsentElsewhere(consentApi);
    dispatch(acceptAll());

    expect(widgetsApi.resetCallback).toHaveBeenCalled();
  });

  it('resets consent_bar_visible widget once denied', async () => {
    const {dispatch, consentApi, widgetsApi} = setup();

    await eagerlyRequireConsentElsewhere(consentApi);
    dispatch(denyAll());

    expect(widgetsApi.resetCallback).toHaveBeenCalled();
  });
});
