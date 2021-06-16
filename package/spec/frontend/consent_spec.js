import {Consent} from 'pageflow/frontend/Consent';
import {consent} from 'pageflow/frontend';
import {flushPromises} from '$support/flushPromises';

describe('consent', () => {
  it('resolves require call after all vendors have been accepted', async () => {
    const consent = new Consent();

    consent.registerVendor('XY Analytics', {paradigm: 'opt-in'});
    const promise = consent.require('XY Analytics');
    const {acceptAll} = await consent.requested();
    acceptAll();

    return expect(promise).resolves.toEqual('fulfilled');
  });

  it('resolves require call after vendors have all been denied', async () => {
    const consent = new Consent();

    consent.registerVendor('XY Analytics', {paradigm: 'opt-in'});
    const promise = consent.require('XY Analytics');
    const {denyAll} = await consent.requested();
    denyAll();

    return expect(promise).resolves.toEqual('failed');
  });

  it('resolves require call if vendor has skip paradigm', async () => {
    const consent = new Consent();

    consent.registerVendor('XY Analytics', {paradigm: 'skip'});
    const promise = consent.require('XY Analytics');

    return expect(promise).resolves.toEqual('fulfilled');
  });

  it('does not request if no vendors registered', async () => {
    const consent = new Consent();
    const callback = jest.fn();

    consent.requested().then(callback);
    await flushPromises();

    expect(callback).not.toHaveBeenCalled();
  });

  it('does not request if paradigm is skip', async () => {
    const consent = new Consent();
    const callback = jest.fn();

    consent.registerVendor('XY Analytics', {paradigm: 'skip'});
    consent.requested().then(callback);
    await flushPromises();

    expect(callback).not.toHaveBeenCalled();
  });

  it('throws error if paradigm invalid', () => {
    const consent = new Consent();

    expect(() =>
      consent.registerVendor('XY Analytics', {paradigm: 'rainbow'})
    ).toThrow(/unknown paradigm/);
  })

  it('throws error if vendor is registered after requested has been called', () => {
    const consent = new Consent();

    consent.requested();

    expect(() =>
      consent.registerVendor('XY Analytics', {paradigm: 'opt-in'})
    ).toThrow(/registered after requested/);
  });

  it('exports singleton consent object', () => {
    expect(consent).toBeDefined();
  });
});
