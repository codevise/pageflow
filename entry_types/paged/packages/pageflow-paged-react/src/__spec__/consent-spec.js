import consent from 'consent';
import {isConsentUIVisible, requestedVendors} from 'consent/selectors';
import {acceptAll, denyAll, save} from 'consent/actions';
import createStore from 'createStore';

import sinon from 'sinon';
import {flushPromises} from 'support/flushPromises';

describe('consent', () => {
  let resolve;

  function setup() {
    const promise = new Promise((r) => resolve = r);
    const consentApi = {
      requested: async function() {
        const {vendors} = await promise;
        const acceptAll = jest.fn();
        const denyAll = jest.fn();
        const save = jest.fn();

        this.mostRecentlyReturnedAcceptAll = acceptAll;
        this.mostRecentlyReturnedDenyAll = denyAll;
        this.mostRecentlyReturnedSave = save;

        return {
          acceptAll,
          denyAll,
          save,
          vendors
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

  async function eagerlyRequireConsentElsewhere(consentApi, {vendors} = {}) {
    if (!vendors) {
      vendors = ['elsewhere'];
    }
    // in real use cases, some embed or analytics code elsewhere in
    // the codebase might use the eager require API like this
    resolve({vendors});
    await flushPromises();
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

  it('is hidden on save', async () => {
    const {select, consentApi, dispatch} = setup();

    await eagerlyRequireConsentElsewhere(consentApi);
    dispatch(save());
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

  it('calls `save` returned by `required` on `save` action', async () => {
    const {consentApi, dispatch} = setup();

    await eagerlyRequireConsentElsewhere(consentApi);
    dispatch(save({vendorA: true}));

    expect(consentApi.mostRecentlyReturnedSave).toHaveBeenCalledWith({vendorA: true});
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

  describe('requestedVendors selector', () => {
    it('is empty array by default', () => {
      const {select} = setup();

      const result = select(requestedVendors);

      expect(result).toEqual([]);
    });

    it('returns vendors returned by last call to `requested`', async () => {
      const {consentApi, select} = setup();
      await eagerlyRequireConsentElsewhere(consentApi, {vendors: [{name: 'webtrekk', displayName: 'Webtrekk'}]});

      const result = select(requestedVendors);

      expect(result).toEqual([{name: 'webtrekk', displayName: 'Webtrekk'}]);
    });
  });
});
