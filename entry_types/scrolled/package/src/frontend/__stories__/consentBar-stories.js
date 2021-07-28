import React from 'react';
import {storiesOf} from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import {normalizeAndMergeFixture} from 'pageflow-scrolled/spec/support/stories';
import {ConsentBar} from '../thirdPartyConsent';
import {Entry, RootProviders} from 'pageflow-scrolled/frontend';
import {Consent} from 'pageflow/frontend';

const stories = storiesOf('Frontend/Consent Bar', module);

function createConsent() {
  const consent = Consent.create();

  consent.registerVendor('YouTube', {
    paradigm: 'opt-in',
    displayName: 'YouTube',
    description: `
      Video service<br/>
      <br/>
      <b>Privacy Page</b><br/>
      <a href="http://example.com">Link</a>
    `
  });
  consent.closeVendorRegistration();

  return consent;
}

stories.add(
  'Desktop',
  () =>
    <RootProviders seed={normalizeAndMergeFixture()}
                   consent={createConsent()}>
      <ConsentBar defaultExpanded={true} />
      <Backdrop />
    </RootProviders>
);

stories.add(
  'Mobile',
  () =>
    <RootProviders seed={normalizeAndMergeFixture()}
                   consent={createConsent()}>
      <ConsentBar defaultExpanded={true} />
      <Backdrop />
    </RootProviders>,
  {
    percy: {
      widths: [320]
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone6'
    }
  }
);

function Backdrop() {
  return (
    <div style={{background: '#aaa', height: '100vh'}} />
  );
}
