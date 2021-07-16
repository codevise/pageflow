import consent from 'consent';
import {isConsentUIVisible, requestedVendors} from 'consent/selectors';
import {acceptAll, denyAll, save} from 'consent/actions';
import createStore from 'createStore';

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

    const store = createStore([consent], {consent: consentApi});

    return {
      dispatch: store.dispatch.bind(store),

      select(selector) {
        return selector(store.getState());
      },

      consentApi
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
