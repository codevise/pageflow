import React from 'react';
import {storiesOf} from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import {
  normalizeAndMergeFixture,
  filePermaId,
} from 'pageflow-scrolled/spec/support/stories';
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

function getSeed({darkWidgets} = {}) {
  return {
    themeOptions: {darkWidgets},
    widgets: [{
      role: 'consent',
      typeName: 'consentBar',
      configuration: {defaultExpanded: true}
    }],
    sections: [{
      configuration: {
        fullHeight: true,
        backdrop: {
          image: filePermaId('imageFiles', 'turtle')
        }
      }
    }]
  };
};

stories.add(
  'Desktop',
  () =>
    <RootProviders seed={normalizeAndMergeFixture(getSeed())}
                   consent={createConsent()}>
      <Entry />
    </RootProviders>
);

stories.add(
  'Desktop - Dark',
  () =>
    <RootProviders seed={normalizeAndMergeFixture(getSeed({darkWidgets: true}))}
                   consent={createConsent()}>
      <Entry />
    </RootProviders>
);

stories.add(
  'Mobile',
  () =>
    <RootProviders seed={normalizeAndMergeFixture(getSeed())}
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

stories.add(
  'Mobile - Dark',
  () =>
    <RootProviders seed={normalizeAndMergeFixture(getSeed({darkWidgets: true}))}
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
