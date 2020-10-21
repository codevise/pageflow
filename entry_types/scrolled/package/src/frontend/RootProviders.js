import React from 'react';

import {BrowserFeaturesProvider} from './useBrowserFeature';
import {EntryStateProvider} from '../entryState';
import {LocaleProvider} from './i18n';
import {FocusOutlineProvider} from './focusOutline';
import {PhonePlatformProvider} from './PhonePlatformProvider';
import {MediaMutedProvider} from './useMediaMuted';

export function RootProviders({seed, children}) {
  return (
    <FocusOutlineProvider>
      <BrowserFeaturesProvider>
        <PhonePlatformProvider>
          <MediaMutedProvider>
            <EntryStateProvider seed={seed}>
              <LocaleProvider>
                {children}
              </LocaleProvider>
            </EntryStateProvider>
          </MediaMutedProvider>
        </PhonePlatformProvider>
      </BrowserFeaturesProvider>
    </FocusOutlineProvider>
  );
}
