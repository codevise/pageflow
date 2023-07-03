import React from 'react';
import {storiesOf} from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import {normalizeAndMergeFixture} from 'pageflow-scrolled/spec/support/stories';
import './index';
import {Entry, RootProviders} from 'pageflow-scrolled/frontend';
import {Consent} from 'pageflow/frontend';

const stories = storiesOf('Widgets/Consent Bar', module);

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

const seed = {
  widgets: [{
    role: 'consent',
    typeName: 'consentBar'
  }],
  sections: [{}]
};

stories.add(
  'Desktop',
  () =>
    <RootProviders seed={normalizeAndMergeFixture(seed)}
                   consent={createConsent()}>
      <Entry />
    </RootProviders>
);

stories.add(
  'Mobile',
  () =>
    <RootProviders seed={normalizeAndMergeFixture(seed)}
                   consent={createConsent()}>
      <Entry />
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
