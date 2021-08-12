import {
  frontend,
  ThirdPartyOptIn,
  ThirdPartyOptOutInfo
} from 'pageflow-scrolled/frontend';
import {registerConsentVendors} from 'frontend/thirdPartyConsent';

import React, {useState} from 'react';
import {cookies, Consent} from 'pageflow/frontend';

import {normalizeSeed} from 'support/normalizeSeed';
import {renderEntry as originalRenderEntry} from 'support/pageObjects';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {act, fireEvent, within} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// The consent API used to set up and update consent state is based an
// async methods. React Testing Library wraps `render` and `fireEvent`
// calls into `act` to ensure effects are flushed. It does not wait
// for micro tasks (i.e. handlers of resolved promises), though. React
// provides an async version of `act` which also waits for these tasks
// to complete.

async function renderEntry({seed, consent = Consent.create()}) {
  registerConsentVendors({
    contentElementTypes: frontend.contentElementTypes,
    seed: normalizeSeed(seed),
    consent
  });

  let result;

  await act(async () => {
    result = originalRenderEntry({seed, consent});
  });

  return result;
}

async function click(element) {
  await act(async () => { fireEvent.click(element); });
}

describe('Third party consent', () => {
  beforeEach(() => {
    cookies.removeItem('optIn', '/', 'example.com');
    cookies.removeItem('optIn', '/', 'story.example.com');
  });

  beforeEach(() => jest.restoreAllMocks());

  useFakeTranslations({
    'pageflow_scrolled.public.third_party_consent.opt_in_prompt.someService': 'Enable SomeService?',
    'pageflow_scrolled.public.third_party_consent.confirm': 'Confirm',
    'pageflow_scrolled.public.third_party_consent.opt_out.prompt': '%{link} to opt out',
    'pageflow_scrolled.public.third_party_consent.opt_out.prompt_link': 'Click here',
    'pageflow_scrolled.public.third_party_consent.someService.vendor_name.': 'Some Service'
  });

  describe('vendor registration', () => {
    it('relies on required vendors reported by content elements', async () => {
      const consent = Consent.create();

      frontend.contentElementTypes.register('test', {
        consentVendors({configuration, t}) {
          return [{
            name: configuration.provider,
            displayName: t('vendor_name', {
              scope: `pageflow_scrolled.public.third_party_consent.${configuration.provider}`
            })
          }];
        },

        component: function Component() {
          return (<div />);
        }
      });

      await renderEntry({
        consent,
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test', configuration: {provider: 'someService'}}]
        }
      });

      const {vendors} = await consent.requested();

      expect(vendors).toMatchObject([{name: 'someService'}]);
    });

    it('allows setting custom paradigm', async () => {
      const consent = Consent.create();
      jest.spyOn(consent, 'registerVendor');

      frontend.contentElementTypes.register('test', {
        consentVendors() {
          return [{
            name: 'vendor',
            displayName: 'Vendor',
            paradigm: 'lazy opt-in'
          }];
        },

        component: function Component() {
          return (<div />);
        }
      });

      await renderEntry({
        consent,
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test', configuration: {provider: 'someService'}}]
        }
      });

      expect(consent.registerVendor).toHaveBeenCalledWith(
        'vendor',
        expect.objectContaining({paradigm: 'lazy opt-in'})
      )
    });

    it('ignores custom paradigm if no cookieName is set', async () => {
      const consent = Consent.create();
      jest.spyOn(consent, 'registerVendor');

      frontend.contentElementTypes.register('test', {
        consentVendors() {
          return [{
            name: 'vendor',
            displayName: 'Vendor',
            paradigm: 'lazy opt-in'
          }];
        },

        component: function Component() {
          return (<div />);
        }
      });

      await renderEntry({
        consent,
        seed: {
          contentElements: [{typeName: 'test', configuration: {provider: 'someService'}}]
        }
      });

      expect(consent.registerVendor).toHaveBeenCalledWith(
        'vendor',
        expect.objectContaining({paradigm: 'skip'})
      )
    });
  });

  describe('opt in', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        consentVendors: [{name: 'someService'}],

        component: function Component() {
          return (
            <div data-testid="test-content-element">
              <ThirdPartyOptIn providerName="someService">
                <div>Data from SomeService</div>
              </ThirdPartyOptIn>
            </div>
          );
        }
      });
    });

    it('renders prompt when privacy cookie configured in theme options is not set', async () => {
      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('test-content-element')).toHaveTextContent('Enable SomeService?');
    });

    it('renders prompt when flag for provider in privacy cookie is false', async () => {
      cookies.setItem('optIn', '{"someService": false}');

      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('test-content-element')).toHaveTextContent('Enable SomeService?');
    });

    it('is skipped if flag for provider is true in privacy cookie', async () => {
      cookies.setItem('optIn', '{"someService": true}');

      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('test-content-element')).toHaveTextContent('Data from SomeService');
    });

    it('is skipped if privacy cookie name is not set in theme options', async () => {
      const {getByTestId} = await renderEntry({
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('test-content-element')).toHaveTextContent('Data from SomeService');
    });

    it('is skipped after consent has been given', async () => {
      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test'}]
        }
      });

      const {getByText} = within(getByTestId('test-content-element'));

      await click(getByText('Confirm'));

      expect(getByTestId('test-content-element')).toHaveTextContent('Data from SomeService');
    });

    it('sets flag for provider in privacy cookie when consent is given', async () => {
      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test'}]
        }
      });

      const {getByText} = within(getByTestId('test-content-element'));
      await click(getByText('Confirm'));

      expect(JSON.parse(cookies.getItem('optIn'))).toMatchObject({'someService': true});
    });

    it('uses cookie domain from theme option when setting cookie', async () => {
      // location.hostname is set to story.example.com via testURL in jest.config.js

      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {
            thirdPartyConsent: {
              cookieName: 'optIn',
              cookieDomain: 'example.com'
            }},
          contentElements: [{typeName: 'test'}]
        }
      });

      jest.spyOn(cookies, 'setItem');
      const {getByText} = within(getByTestId('test-content-element'));
      await click(getByText('Confirm'));

      expect(cookies.setItem).toHaveBeenCalledWith(
        'optIn', expect.anything(),
        expect.objectContaining({
          path: '/',
          domain: 'example.com'
        })
      );
    });

    it('does not use domain if cookie domain does not match but still enabled embed', async () => {
      // location.hostname is set to story.example.com via testURL in jest.config.js

      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {
            thirdPartyConsent: {
              cookieName: 'optIn',
              cookieDomain: 'other.com'
            }},
          contentElements: [{typeName: 'test'}]
        }
      });

      jest.spyOn(cookies, 'setItem');
      const {getByText} = within(getByTestId('test-content-element'));
      await click(getByText('Confirm'));

      expect(getByTestId('test-content-element')).toHaveTextContent('Data from SomeService');
      expect(cookies.setItem).toHaveBeenCalledWith(
        'optIn', expect.anything(),
        expect.objectContaining({
          path: '/',
          domain: null
        })
      );
    });
  });

  describe('opt in with render function', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        consentVendors: [{name: 'someService'}],

        component: function Component({configuration}) {
          return (
            <div data-testid={configuration.testId}>
              <ThirdPartyOptIn providerName="someService">
                {({consentedHere}) => <div>{consentedHere ? 'Consented here' : 'Consented elsewhere'}</div>}
              </ThirdPartyOptIn>
            </div>
          );
        }
      });
    });

    it('passes flag which is true if consent was just given in current component', async () => {
      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [
            {typeName: 'test', configuration: {testId: 'content-element-a'}},
            {typeName: 'test', configuration: {testId: 'content-element-b'}}
          ]
        }
      });

      const {getByText} = within(getByTestId('content-element-a'));
      await click(getByText('Confirm'));

      expect(getByTestId('content-element-a')).toHaveTextContent('Consented here');
      expect(getByTestId('content-element-b')).toHaveTextContent('Consented elsewhere');
    });
  });

  describe('opt in with missing provider', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        consentVendors: [],

        component: function Component({configuration}) {
          return (
            <div data-testid="test-content-element">
              <ThirdPartyOptIn providerName={null}>
                <div>Blank slate</div>
              </ThirdPartyOptIn>
            </div>
          );
        }
      });
    });

    it('is skipped', async () => {
      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('test-content-element')).toHaveTextContent('Blank slate');
    });
  });

  describe('opt out info', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        consentVendors: [{name: 'someService'}],

        component: function Component() {
          return (
            <div data-testid="test-content-element">
              <ThirdPartyOptIn providerName="someService">
                <ThirdPartyOptOutInfo providerName="someService" />
                <div>Data from SomeService</div>
              </ThirdPartyOptIn>
            </div>
          );
        }
      });
    });

    it('is displayed when consent has been given and privacy link is set in theme options', async () => {
      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {
            thirdPartyConsent: {
              cookieName: 'optIn',
              optOutUrl: 'https://example.com/privacy'
            }
          },
          contentElements: [{typeName: 'test'}]
        }
      });

      const {getByText} = within(getByTestId('test-content-element'));
      await click(getByText('Confirm'));

      expect(getByTestId('test-content-element')).toHaveTextContent('Click here to opt out');
      expect(getByText('Click here')).toHaveAttribute('href', 'https://example.com/privacy');
    });

    it('is not displayed if consent has not been given', async () => {
      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {
            thirdPartyConsent: {
              cookieName: 'optIn',
              optOutUrl: 'https://example.com/privacy'
            }
          },
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('test-content-element')).not.toHaveTextContent('Click here to opt out');
    });
  });

  describe('opt out info with custom hiding logic', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        consentVendors: [{name: 'someService'}],

        component: function Component() {
          const [hideOptOutInfo, setHideOptOutInfo] = useState(false);

          return (
            <div data-testid="test-content-element">
              <ThirdPartyOptIn providerName="someService">
                <ThirdPartyOptOutInfo providerName="someService" hide={hideOptOutInfo} />
                <div>Data from SomeService</div>
                <button onClick={() => setHideOptOutInfo(!hideOptOutInfo)}>
                  Toggle
                </button>
              </ThirdPartyOptIn>
            </div>
          );
        }
      });
    });

    it('allows dynamically hiding the tooltip', async () => {
      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {
            thirdPartyConsent: {
              cookieName: 'optIn',
              optOutUrl: 'https://example.com/privacy'
            }
          },
          contentElements: [{typeName: 'test'}]
        }
      });

      const {getByText} = within(getByTestId('test-content-element'));
      await click(getByText('Confirm'));
      expect(getByText('to opt out', {exact: false})).toBeVisible();

      fireEvent.click(getByText('Toggle'));
      expect(getByText('to opt out', {exact: false})).not.toBeVisible();
    });
  });

  describe('provider name mapping', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        consentVendors: [{name: 'someService'}],

        component: function Component() {
          return (
            <div data-testid="test-content-element">
              <ThirdPartyOptIn providerName="someService">
                <div>Data from SomeService</div>
              </ThirdPartyOptIn>
            </div>
          );
        }
      });
    });

    it('is used when reading from the cookie', async () => {
      cookies.setItem('optIn', '{"some-service": true}')

      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {
            thirdPartyConsent: {
              cookieName: 'optIn',
              cookieProviderNameMapping: {
                someService: 'some-service'
              }
            }
          },
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('test-content-element')).toHaveTextContent('Data from SomeService');
    });

    it('is used when writing cookie', async () => {
      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {
            thirdPartyConsent: {
              cookieName: 'optIn',
              cookieProviderNameMapping: {
                someService: 'some-service'
              }
            }
          },
          contentElements: [{typeName: 'test'}]
        }
      });

      const {getByText} = within(getByTestId('test-content-element'));
      await click(getByText('Confirm'));

      expect(JSON.parse(cookies.getItem('optIn'))).toMatchObject({'some-service': true});
    });

    it('preserves other provider flags in cookie', async () => {
      cookies.setItem('optIn', '{"something-else": true, "evil-corp": false}')

      const {getByTestId} = await renderEntry({
        seed: {
          themeOptions: {
            thirdPartyConsent: {
              cookieName: 'optIn',
              cookieProviderNameMapping: {
                someService: 'some-service'
              }
            }
          },
          contentElements: [{typeName: 'test'}]
        }
      });

      const {getByText} = within(getByTestId('test-content-element'));
      await click(getByText('Confirm'));

      expect(JSON.parse(cookies.getItem('optIn')))
        .toMatchObject({
          'something-else': true,
          'evil-corp': false,
          'some-service': true
        });
    });
  });
});
