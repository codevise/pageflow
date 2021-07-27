import React from 'react';

import {Bar} from 'frontend/thirdPartyConsent/Bar';
import {Consent, cookies} from 'pageflow/frontend';

import {fireEvent} from '@testing-library/react';
import {renderInEntry} from 'support';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('Bar', () => {
  beforeEach(() => {
    cookies.removeItem('pageflow_consent');
  });

  useFakeTranslations({
    'pageflow_scrolled.public.consent_prompt_html': 'Agreed? <a href="%{privacyLinkUrl}">Privacy</a>',
    'pageflow_scrolled.public.consent_accept_all': 'Accept all',
    'pageflow_scrolled.public.consent_deny_all': 'Deny all',
    'pageflow_scrolled.public.consent_configure': 'Configure',
    'pageflow_scrolled.public.consent_save': 'Save'
  })

  it('renders nothing by default', async () => {
    const consent = Consent.create();

    const {container} = renderInEntry(<Bar />, {consent});

    expect(container).toBeEmptyDOMElement();
  });

  it('can accept all vendors', async () => {
    const consent = Consent.create();
    consent.registerVendor('someService', {
      paradigm: 'opt-in'
    });
    consent.closeVendorRegistration();

    const promise = consent.require('someService');
    const {findByRole} = renderInEntry(<Bar />, {consent});
    fireEvent.click(await findByRole('button', {name: 'Accept all'}));

    expect(await promise).toEqual('fulfilled');
  });

  it('can deny all vendors', async () => {
    const consent = Consent.create();
    consent.registerVendor('someService', {
      paradigm: 'opt-in'
    });
    consent.closeVendorRegistration();

    const promise = consent.require('someService');
    const {findByRole} = renderInEntry(<Bar />, {consent});
    fireEvent.click(await findByRole('button', {name: 'Deny all'}));

    expect(await promise).toEqual('failed');
  });

  it('can save vendor selection', async () => {
    const consent = Consent.create();
    consent.registerVendor('someService', {
      paradigm: 'opt-in',
      displayName: 'Some Service'
    });
    consent.closeVendorRegistration();

    const promise = consent.require('someService');
    const {findByRole, getByRole, getByLabelText} = renderInEntry(<Bar />, {consent});
    fireEvent.click(await findByRole('button', {name: 'Configure'}));
    fireEvent.click(getByLabelText('Some Service'));
    fireEvent.click(getByRole('button', {name: 'Save'}));

    expect(await promise).toEqual('fulfilled');
  });

  it('is hidden on decision', async () => {
    const consent = Consent.create();
    consent.registerVendor('someService', {
      paradigm: 'opt-in'
    });
    consent.closeVendorRegistration();

    const {container, findByRole} = renderInEntry(<Bar />, {consent});
    fireEvent.click(await findByRole('button', {name: 'Accept all'}))

    expect(container).toBeEmptyDOMElement();
  });

  it('lists requested vendors in privacy page link', async () => {
    const consent = Consent.create();
    consent.registerVendor('someService', {paradigm: 'opt-in'});
    consent.registerVendor('otherService', {paradigm: 'opt-in'});
    consent.closeVendorRegistration();

    const {findByRole} = renderInEntry(
      <Bar />,
      {
        consent,
        seed: {
          entry: {
            locale: 'en',
          },
          legalInfo: {
            privacy: {
              url: 'http://example.com/privacy'
            }
          }
        }
      }
    );

    expect(await findByRole('link')).toHaveAttribute(
      'href',
      'http://example.com/privacy?lang=en&vendors=someService,otherService#consent'
    );
  });
});
