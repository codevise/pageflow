import {
  frontend,
  ThirdPartyOptIn,
  ThirdPartyOptOutInfo
} from 'pageflow-scrolled/frontend';

import React, {useState} from 'react';
import {cookies} from 'pageflow/frontend';

import {renderEntry} from 'support/pageObjects';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {fireEvent, within} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('Third party consent', () => {
  beforeEach(() => cookies.removeItem('optIn'));

  useFakeTranslations({
    'pageflow_scrolled.public.third_party_consent.opt_in_prompt.someService': 'Enable SomeService?',
    'pageflow_scrolled.public.third_party_consent.confirm': 'Confirm',
    'pageflow_scrolled.public.third_party_consent.opt_out.prompt': '%{link} to opt out',
    'pageflow_scrolled.public.third_party_consent.opt_out.prompt_link': 'Click here',
  });

  describe('opt in', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
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

    it('renders prompt when privacy cookie configured in theme options is not set', () => {
      const {getByTestId} = renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('test-content-element')).toHaveTextContent('Enable SomeService?');
    });

    it('renders prompt when flag for provider in privacy cookie is false', () => {
      cookies.setItem('optIn', '{"someService": false}')

      const {getByTestId} = renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('test-content-element')).toHaveTextContent('Enable SomeService?');
    });

    it('is skipped if flag for provider is true in privacy cookie', () => {
      cookies.setItem('optIn', '{"someService": true}')

      const {getByTestId} = renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('test-content-element')).toHaveTextContent('Data from SomeService');
    });

    it('is skipped if privacy cookie name is not set in theme options', () => {
      const {getByTestId} = renderEntry({
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('test-content-element')).toHaveTextContent('Data from SomeService');
    });

    it('is skipped after consent has been given', () => {
      const {getByTestId} = renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test'}]
        }
      });

      const {getByText} = within(getByTestId('test-content-element'));
      fireEvent.click(getByText('Confirm'));

      expect(getByTestId('test-content-element')).toHaveTextContent('Data from SomeService');
    });

    it('sets flag for provider in privacy cookie when consent is given', () => {
      const {getByTestId} = renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [{typeName: 'test'}]
        }
      });

      const {getByText} = within(getByTestId('test-content-element'));
      fireEvent.click(getByText('Confirm'));

      expect(JSON.parse(cookies.getItem('optIn'))).toMatchObject({'someService': true});
    });

    it('uses cookie domain from theme option when setting cookie', () => {
      const {getByTestId} = renderEntry({
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
      fireEvent.click(getByText('Confirm'));

      expect(cookies.setItem).toHaveBeenCalledWith('optIn', expect.anything(), null, 'example.com');
    });
  });

  describe('opt in with render function', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        component: function Component({configuration}) {
          return (
            <div data-testid={configuration.testId}>
              <ThirdPartyOptIn providerName="someService">
                {(consentedHere) => <div>{consentedHere ? 'Consented here' : 'Consented elsewhere'}</div>}
              </ThirdPartyOptIn>
            </div>
          );
        }
      });
    });

    it('passes flag which is true if consent was just given in current component', () => {
      const {getByTestId} = renderEntry({
        seed: {
          themeOptions: {thirdPartyConsent: {cookieName: 'optIn'}},
          contentElements: [
            {typeName: 'test', configuration: {testId: 'content-element-a'}},
            {typeName: 'test', configuration: {testId: 'content-element-b'}}
          ]
        }
      });

      const {getByText} = within(getByTestId('content-element-a'));
      fireEvent.click(getByText('Confirm'));

      expect(getByTestId('content-element-a')).toHaveTextContent('Consented here');
      expect(getByTestId('content-element-b')).toHaveTextContent('Consented elsewhere');
    });
  });

  describe('opt out info', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
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

    it('is displayed when consent has been given and privacy link is set in theme options', () => {
      const {getByTestId} = renderEntry({
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
      fireEvent.click(getByText('Confirm'));

      expect(getByTestId('test-content-element')).toHaveTextContent('Click here to opt out');
      expect(getByText('Click here')).toHaveAttribute('href', 'https://example.com/privacy');
    });

    it('is not displayed if consent has not been given', () => {
      const {getByTestId} = renderEntry({
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

    it('allows dynamically hiding the tooltip', () => {
      const {getByTestId} = renderEntry({
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
      fireEvent.click(getByText('Confirm'));
      expect(getByText('to opt out', {exact: false})).toBeVisible();

      fireEvent.click(getByText('Toggle'));
      expect(getByText('to opt out', {exact: false})).not.toBeVisible();
    });
  });

  describe('provider name mapping', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
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

    it('is used when reading from the cookie', () => {
      cookies.setItem('optIn', '{"some-service": true}')

      const {getByTestId} = renderEntry({
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

    it('is used when writing cookie', () => {
      const {getByTestId} = renderEntry({
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
      fireEvent.click(getByText('Confirm'));

      expect(JSON.parse(cookies.getItem('optIn'))).toMatchObject({'some-service': true});
    });

    it('preserves other provider flags in cookie', () => {
      cookies.setItem('optIn', '{"something-else": true, "evil-corp": false}')

      const {getByTestId} = renderEntry({
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
      fireEvent.click(getByText('Confirm'));

      expect(JSON.parse(cookies.getItem('optIn')))
        .toMatchObject({
          'something-else': true,
          'evil-corp': false,
          'some-service': true
        });
    });
  });
});
