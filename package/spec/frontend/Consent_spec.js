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

      consent.registerVendor('XY Analytics', {paradigm: 'skip'});
      consent.closeVendorRegistration();
      const promise = consent.require('XY Analytics');

      return expect(promise).resolves.toEqual('fulfilled');
    });

    it('does not request consent UI', async () => {
      const consent = new Consent(requiredOptions);
      const callback = jest.fn();

      consent.registerVendor('XY Analytics', {paradigm: 'skip'});
      consent.closeVendorRegistration();
      consent.requested().then(callback);
      await flushPromises();

      expect(callback).not.toHaveBeenCalled();
    });

    it('does not include vendor in relevantVendors', () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('XY Analytics', {paradigm: 'skip'});
      consent.closeVendorRegistration();

      expect(consent.relevantVendors()).toEqual([]);
    });
  });

  describe('for opt-in paradigm', () => {
    it('resolves require call after all vendors have been accepted', async () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('XY Analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const promise = consent.require('XY Analytics');
      const {acceptAll} = await consent.requested();
      acceptAll();

      return expect(promise).resolves.toEqual('fulfilled');
    });

    it('ignores not-required vendors on acceptAll', async () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('XY Analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const {acceptAll} = await consent.requested();

      expect(acceptAll).not.toThrow();
    });

    it('resolves require call after vendors have all been denied', async () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('XY Analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const promise = consent.require('XY Analytics');
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

      consent.registerVendor('XY Analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const {acceptAll} = await consent.requested();
      acceptAll();

      const consentInNextSession = new Consent({...requiredOptions, cookies});
      consentInNextSession.registerVendor('XY Analytics', {paradigm: 'opt-in'});
      consentInNextSession.closeVendorRegistration();
      const promise = consentInNextSession.require('XY Analytics');

      return expect(promise).resolves.toEqual('fulfilled');
    });

    it('resolves require call if all vendors have been denied in previous session', async () => {
      const cookies = fakeCookies();
      const consent = new Consent({...requiredOptions, cookies});

      consent.registerVendor('XY Analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();
      const {denyAll} = await consent.requested();
      denyAll();

      const consentInNextSession = new Consent({...requiredOptions, cookies});
      consentInNextSession.registerVendor('XY Analytics', {paradigm: 'opt-in'});
      consentInNextSession.closeVendorRegistration();
      const promise = consentInNextSession.require('XY Analytics');

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

         consent.registerVendor('XY Analytics', {paradigm: 'opt-in'});
         consent.closeVendorRegistration();
         const {denyAll} = await consent.requested();
         denyAll();

         const consentInNextSession = new Consent({...requiredOptions, cookies});
         consentInNextSession.registerVendor('XY Analytics', {paradigm: 'opt-in'});
         consentInNextSession.closeVendorRegistration();
         consentInNextSession.requested().then(callback);
         await flushPromises();

         expect(callback).not.toHaveBeenCalled();
       });

    it('includes vendor in relevantVendors', () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('XY Analytics', {paradigm: 'opt-in'});
      consent.closeVendorRegistration();

      expect(consent.relevantVendors()).toEqual([
        expect.objectContaining({name: 'XY Analytics', state: 'undecided'})
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
      consent.registerVendor('xy Analytics', {
        paradigm: 'external opt-out',
        cookieName: 'theCookie',
        cookieKey: 'xyAnalytics'
      });
      consent.closeVendorRegistration();
      const promise = consent.require('xy Analytics');

      return expect(promise).resolves.toEqual('failed');
    });

    it('does not request consent UI', async () => {
      const consent = new Consent(requiredOptions);
      const callback = jest.fn();

      consent.registerVendor('XY Analytics', {paradigm: 'external opt-out'});
      consent.closeVendorRegistration();
      consent.requested().then(callback);
      await flushPromises();

      expect(callback).not.toHaveBeenCalled();
    });

    it('includes vendor in relevantVendors', () => {
      const consent = new Consent(requiredOptions);

      consent.registerVendor('XY Analytics', {paradigm: 'external opt-out'});
      consent.closeVendorRegistration();

      expect(consent.relevantVendors()).toEqual([
        expect.objectContaining({name: 'XY Analytics'})
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

    consent.registerVendor('XY Analytics', {paradigm: 'opt-in'});
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

  it('returns display name with requested opt-in vendors', async () => {
    const consent = new Consent(requiredOptions);

    consent.registerVendor('xy_analytics', {
      displayName: 'XY Analytics',
      paradigm: 'opt-in'
    });
    consent.closeVendorRegistration();

    const result = await consent.requested();

    expect(result.vendors).toMatchObject([{displayName: 'XY Analytics'}]);
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
      consent.registerVendor('XY Analytics', {paradigm: 'rainbow'})
    ).toThrow(/unknown paradigm/);
  });

  it('throws error if vendor is registered after registration has been closed', () => {
    const consent = new Consent(requiredOptions);

    consent.closeVendorRegistration();

    expect(() =>
      consent.registerVendor('XY Analytics', {paradigm: 'opt-in'})
    ).toThrow(/registered after registration has been closed/);
  });

  it('throws error if required vendor has not been registered', () => {
    const consent = new Consent(requiredOptions);

    consent.closeVendorRegistration();

    expect(() =>
      consent.require('XY Analytics')
    ).toThrow(/unknown vendor/);
  });

  it('throws error if accepted vendor has not been registered', () => {
    const consent = new Consent(requiredOptions);

    consent.closeVendorRegistration();

    expect(() =>
           consent.accept('XY Analytics')
          ).toThrow(/unknown vendor/);
  });

  it('throws error if denied vendor has not been registered', () => {
    const consent = new Consent(requiredOptions);

    consent.closeVendorRegistration();

    expect(() =>
           consent.accept('XY Analytics')
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
