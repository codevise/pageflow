import {Consent} from 'pageflow/frontend/Consent';
import {consent} from 'pageflow/frontend';
import {flushPromises} from '$support/flushPromises';

describe('Consent', () => {
  let requiredOptions;

  beforeEach(() => {
    requiredOptions = {cookies: fakeCookies()};
  });

  describe('for skip paradigm', () => {
    it('fulfills require call', async () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('xy_analytics', {paradigm: 'skip'});
      consent.closeVendorRegistration();
      const promise = consent.require('xy_analytics');

      return expect(promise).resolves.toEqual('fulfilled');
    });

    it('does not request consent UI', async () => {
      const consent = new Consent(requiredOptions);
      const callback = jest.fn();

      consent.registerVendor('xy_analytics', {paradigm: 'skip'});
      consent.closeVendorRegistration();
      consent.requested().then(callback);
      await flushPromises();

      expect(callback).not.toHaveBeenCalled();
    });

    it('does not include vendor in relevantVendors', () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('xy_analytics', {paradigm: 'skip'});
      consent.closeVendorRegistration();

      expect(consent.relevantVendors()).toEqual([]);
    });
  });

  describe('for opt-in paradigm', () => {
    it('resolves require call after all vendors have been accepted', async () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const promise = consent.require('xy_analytics');
      const {acceptAll} = await consent.requested();
      acceptAll();

      return expect(promise).resolves.toEqual('fulfilled');
    });

    it('ignores not-required vendors on acceptAll', async () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const {acceptAll} = await consent.requested();

      expect(acceptAll).not.toThrow();
    });

    it('resolves require call after vendors have all been denied', async () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('XY_Analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const promise = consent.require('XY_Analytics');
      const {denyAll} = await consent.requested();
      denyAll();

      return expect(promise).resolves.toEqual('failed');
    });

    it('resolves require call after vendors have been saved', async () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consent.registerVendor('yz_analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const xyPromise = consent.require('xy_analytics');
      const yzPromise = consent.require('yz_analytics');
      const {save} = await consent.requested();
      save({xy_analytics: false, yz_analytics: true});

      await expect(xyPromise).resolves.toEqual('failed');
      await expect(yzPromise).resolves.toEqual('fulfilled');
    });

    it('resolves require call if all vendors have been accepted in previous session', async () => {
      const cookies = fakeCookies();
      const consent = new Consent({...requiredOptions, cookies});

      consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const {acceptAll} = await consent.requested();
      acceptAll();

      const consentInNextSession = new Consent({...requiredOptions, cookies});
      consentInNextSession.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consentInNextSession.closeVendorRegistration();
      const promise = consentInNextSession.require('xy_analytics');

      return expect(promise).resolves.toEqual('fulfilled');
    });

    it('resolves require call if all vendors have been denied in previous session', async () => {
      const cookies = fakeCookies();
      const consent = new Consent({...requiredOptions, cookies});

      consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const {denyAll} = await consent.requested();
      denyAll();

      const consentInNextSession = new Consent({...requiredOptions, cookies});
      consentInNextSession.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consentInNextSession.closeVendorRegistration();
      const promise = consentInNextSession.require('xy_analytics');

      return expect(promise).resolves.toEqual('failed');
    });

    it('resolves require call if vendors have been saved in previous session', async () => {
      const cookies = fakeCookies();

      const consent = new Consent({...requiredOptions, cookies});
      consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consent.registerVendor('yz_analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const {save} = await consent.requested();
      save({xy_analytics: false, yz_analytics: true});

      const consentInNextSession = new Consent({...requiredOptions, cookies});
      consentInNextSession.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consentInNextSession.registerVendor('yz_analytics', {paradigm: 'opt-in'});
      consentInNextSession.closeVendorRegistration();
      const xyPromise = consentInNextSession.require('xy_analytics');
      const yzPromise = consentInNextSession.require('yz_analytics');

      await expect(xyPromise).resolves.toEqual('failed');
      await expect(yzPromise).resolves.toEqual('fulfilled');
    });

    it('does not request consent UI if consent for all vendors has been decided ' +
       'in previous session', async () => {
         const cookies = fakeCookies();
         const consent = new Consent({...requiredOptions, cookies});
         const callback = jest.fn();

         consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
         consent.closeVendorRegistration();
         const {denyAll} = await consent.requested();
         denyAll();

         const consentInNextSession = new Consent({...requiredOptions, cookies});
         consentInNextSession.registerVendor('xy_analytics', {paradigm: 'opt-in'});
         consentInNextSession.closeVendorRegistration();
         consentInNextSession.requested().then(callback);
         await flushPromises();

         expect(callback).not.toHaveBeenCalled();
       });

    it('allows denying previously accepted vendor if there are undecided opt-in vendors', async () => {
      const cookies = fakeCookies();
      const consent = new Consent({...requiredOptions, cookies});

      consent.registerVendor('old', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const {acceptAll} = await consent.requested();
      acceptAll();

      const consentInNextSession = new Consent({...requiredOptions, cookies});
      consentInNextSession.registerVendor('old', {paradigm: 'opt-in'});
      consentInNextSession.registerVendor('new', {paradigm: 'opt-in'});
      consentInNextSession.closeVendorRegistration();
      const promise = consentInNextSession.require('old');
      const {save} = await consentInNextSession.requested();
      save({old: false, new: true});

      return expect(promise).resolves.toEqual('failed');
    });

    it('includes vendor in relevantVendors', () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();

      expect(consent.relevantVendors()).toEqual([
        expect.objectContaining({name: 'xy_analytics', state: 'undecided'})
      ]);
    });

    it('provides consent state for relevantVendors', async () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('xyAnalytics', {paradigm: 'opt-in'});
      consent.registerVendor('yzAnalytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const {save} = await consent.requested();
      save({xyAnalytics: true, yzAnalytics: false});

      expect(consent.relevantVendors()).toEqual([
        expect.objectContaining({name: 'xyAnalytics', state: 'accepted'}),
        expect.objectContaining({name: 'yzAnalytics', state: 'denied'})
      ]);
    });

    it('allows updating consent decisions via accept/deny', async () => {
      const cookies = fakeCookies();

      const consent = new Consent({...requiredOptions, cookies});
      consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consent.registerVendor('yz_analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      consent.accept('xy_analytics');
      consent.deny('yz_analytics');

      const consentInNextSession = new Consent({...requiredOptions, cookies});
      consentInNextSession.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consentInNextSession.registerVendor('yz_analytics', {paradigm: 'opt-in'});
      consentInNextSession.closeVendorRegistration();
      const xyPromise = consentInNextSession.require('xy_analytics');
      const yzPromise = consentInNextSession.require('yz_analytics');

      await expect(xyPromise).resolves.toEqual('fulfilled');
      await expect(yzPromise).resolves.toEqual('failed');
    });

    it('resolves require call if consent is given via accept', async () => {
      const cookies = fakeCookies();

      const consent = new Consent({...requiredOptions, cookies});
      consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const promise = consent.require('xy_analytics');
      consent.accept('xy_analytics');

      await expect(promise).resolves.toEqual('fulfilled');
    });

    it('resolves requireAccepted call if decision is changed via accept', async () => {
      const cookies = fakeCookies();

      const consent = new Consent({...requiredOptions, cookies});
      consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const promise = consent.requireAccepted('xy_analytics');
      const {save} = await consent.requested();
      save({xy_analytics: false});
      await flushPromises();
      consent.accept('xy_analytics');

      await expect(promise).resolves.toEqual('fulfilled');
    });
  });

  describe('for external opt-out paradigm', () => {
    it('fulfills require call by default', async () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('xyAnalytics', {
        paradigm: 'external opt-out',
        cookieName: 'tracking'
      });
      consent.closeVendorRegistration();
      const promise = consent.require('xyAnalytics');

      return expect(promise).resolves.toEqual('fulfilled');
    });

    it('resolves require call with failed if vendor flag in cookie is false', async () => {
      const cookies = fakeCookies();
      const consent = new Consent({cookies});

      cookies.setItem('tracking', JSON.stringify({xyAnalytics: false}));
      consent.registerVendor('xyAnalytics', {
        paradigm: 'external opt-out',
        cookieName: 'tracking'
      });
      consent.closeVendorRegistration();
      const promise = consent.require('xyAnalytics');

      return expect(promise).resolves.toEqual('failed');
    })

    it('resolves require call with fulfilled if vendor flag in cookie is true', async () => {
      const cookies = fakeCookies();
      const consent = new Consent({cookies});

      cookies.setItem('tracking', JSON.stringify({xyAnalytics: true}));
      consent.registerVendor('xyAnalytics', {
        paradigm: 'external opt-out',
        cookieName: 'tracking'
      });
      consent.closeVendorRegistration();
      const promise = consent.require('xyAnalytics');

      return expect(promise).resolves.toEqual('fulfilled');
    })

    it('allows passing cookie name to registerVendor', async () => {
      const cookies = fakeCookies();
      const consent = new Consent({cookies});

      cookies.setItem('theCookie', JSON.stringify({xyAnalytics: false}));
      consent.registerVendor('xyAnalytics', {
        paradigm: 'external opt-out',
        cookieName: 'theCookie'
      });
      consent.closeVendorRegistration();
      const promise = consent.require('xyAnalytics');

      return expect(promise).resolves.toEqual('failed');
    });

    it('allows custom vendor keys in cookie', async () => {
      const cookies = fakeCookies();
      const consent = new Consent({cookies});

      cookies.setItem('theCookie', JSON.stringify({xyAnalytics: false}));
      consent.registerVendor('xy_analytics', {
        paradigm: 'external opt-out',
        cookieName: 'theCookie',
        cookieKey: 'xyAnalytics'
      });
      consent.closeVendorRegistration();
      const promise = consent.require('xy_analytics');

      return expect(promise).resolves.toEqual('failed');
    });

    it('does not request consent UI', async () => {
      const consent = new Consent(requiredOptions);
      const callback = jest.fn();

      consent.registerVendor('xy_analytics', {paradigm: 'external opt-out'});
      consent.closeVendorRegistration();
      consent.requested().then(callback);
      await flushPromises();

      expect(callback).not.toHaveBeenCalled();
    });

    it('includes vendor in relevantVendors', () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('xy_analytics', {paradigm: 'external opt-out'});
      consent.closeVendorRegistration();

      expect(consent.relevantVendors()).toEqual([
        expect.objectContaining({name: 'xy_analytics'})
      ]);
    });
  });

  it('does not request if no vendors registered', async () => {
    const consent = new Consent(requiredOptions);
    const callback = jest.fn();

    consent.closeVendorRegistration();
    consent.requested().then(callback);
    await flushPromises();

    expect(callback).not.toHaveBeenCalled();
  });

  it('requests only after vendor registration has been closed', async () => {
    const consent = new Consent(requiredOptions);
    const callback = jest.fn();

    consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
    consent.requested().then(callback);
    await flushPromises();

    expect(callback).not.toHaveBeenCalled();

    consent.closeVendorRegistration();
    await flushPromises();

    expect(callback).toHaveBeenCalled();
  });

  it('returns requested opt-in vendors', async () => {
    const consent = new Consent(requiredOptions);

    consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
    consent.closeVendorRegistration();

    const result = await consent.requested();

    expect(result.vendors).toMatchObject([{name: 'xy_analytics'}]);
  });

  it('returns opt-in vendors with state if only some vendors have been decided yet', async () => {
    let consent = new Consent(requiredOptions);
    consent.registerVendor('old_analytics', {paradigm: 'opt-in'});
    consent.closeVendorRegistration();
    consent.accept('old_analytics');

    consent = new Consent(requiredOptions);
    consent.registerVendor('old_analytics', {paradigm: 'opt-in'});
    consent.registerVendor('new_analytics', {paradigm: 'opt-in'});
    consent.closeVendorRegistration();

    const result = await consent.requested();

    expect(result.vendors).toMatchObject([
      {name: 'old_analytics'},
      {name: 'new_analytics'}
    ]);
  });

  it('returns display name with requested opt-in vendors', async () => {
    const consent = new Consent(requiredOptions);

    consent.registerVendor('xy_analytics', {
      displayName: 'xy_analytics',
      paradigm: 'opt-in'
    });
    consent.closeVendorRegistration();

    const result = await consent.requested();

    expect(result.vendors).toMatchObject([{displayName: 'xy_analytics'}]);
  });

  it('returns descriptions with requested opt-in vendors', async () => {
    const consent = new Consent(requiredOptions);

    consent.registerVendor('xy_analytics', {
      description: 'An analytics provider',
      paradigm: 'opt-in'
    });
    consent.closeVendorRegistration();

    const result = await consent.requested();

    expect(result.vendors).toMatchObject([{description: 'An analytics provider'}]);
  });

  it('does not return skipped vendors from requested', async () => {
    const consent = new Consent(requiredOptions);

    consent.registerVendor('xy_analytics', {paradigm: 'opt-in'});
    consent.registerVendor('za_analytics', {paradigm: 'skip'});
    consent.closeVendorRegistration();

    const result = await consent.requested();

    expect(result.vendors).toMatchObject([{name: 'xy_analytics'}]);
  });

  it('throws error if paradigm invalid', () => {
    const consent = new Consent(requiredOptions);

    expect(() =>
      consent.registerVendor('xy_analytics', {paradigm: 'rainbow'})
    ).toThrow(/unknown paradigm/);
  });

  it('throws error if vendor is registered after registration has been closed', () => {
    const consent = new Consent(requiredOptions);

    consent.closeVendorRegistration();

    expect(() =>
      consent.registerVendor('xy_analytics', {paradigm: 'opt-in'})
    ).toThrow(/registered after registration has been closed/);
  });

  it('throws error if required vendor has not been registered', () => {
    const consent = new Consent(requiredOptions);

    consent.closeVendorRegistration();

    expect(() =>
      consent.require('xy_analytics')
    ).toThrow(/unknown vendor/);
  });

  it('throws error if accepted vendor has not been registered', () => {
    const consent = new Consent(requiredOptions);

    consent.closeVendorRegistration();

    expect(() =>
           consent.accept('xy_analytics')
          ).toThrow(/unknown vendor/);
  });

  it('throws error if denied vendor has not been registered', () => {
    const consent = new Consent(requiredOptions);

    consent.closeVendorRegistration();

    expect(() =>
           consent.accept('xy_analytics')
          ).toThrow(/unknown vendor/);
  });

  it('exports singleton consent object', () => {
    expect(consent).toBeDefined();
  });

  describe('.create', () => {
    it('returns consent object', () => {
      expect(Consent.create().registerVendor).toBeDefined();
    });
  });
});

function fakeCookies() {
  const cookies = {};

  return {
    hasItem(key) { return !!cookies[key]; },

    getItem(key) { return cookies[key]; },

    setItem(key, value) { cookies[key] = value; }
  };
}
