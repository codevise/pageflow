import React from 'react';

import {BrowserFeaturesProvider} from './useBrowserFeature';
import {EntryStateProvider} from '../entryState';
import {LocaleProvider} from './i18n';
import {FocusOutlineProvider} from './focusOutline';
import {PhonePlatformProvider} from './PhonePlatformProvider';

export function RootProviders({seed, children}) {
  return (
    <FocusOutlineProvider>
      <BrowserFeaturesProvider>
        <PhonePlatformProvider>
          <EntryStateProvider seed={seed}>
            <LocaleProvider>
              {children}
            </LocaleProvider>
          </EntryStateProvider>
        </PhonePlatformProvider>
      </BrowserFeaturesProvider>
    </FocusOutlineProvider>
  );
}
