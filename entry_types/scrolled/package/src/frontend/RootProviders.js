import React from 'react';

import {BrowserFeaturesProvider} from './useBrowserFeature';
import {EntryStateProvider} from '../entryState';
import {FocusOutlineProvider} from './focusOutline';
import {LocaleProvider} from './i18n';
import {PhonePlatformProvider} from './PhonePlatformProvider';
import {MediaMutedProvider} from './useMediaMuted';
import {AudioFocusProvider} from './useAudioFocus';
import {ThirdPartyConsentProvider} from './ThirdPartyConsentProvider';

export function RootProviders({seed, children}) {
  return (
    <FocusOutlineProvider>
      <BrowserFeaturesProvider>
        <PhonePlatformProvider>
          <MediaMutedProvider>
            <AudioFocusProvider>
              <EntryStateProvider seed={seed}>
                <LocaleProvider>
                  <ThirdPartyConsentProvider>
                    {children}
                  </ThirdPartyConsentProvider>
                </LocaleProvider>
              </EntryStateProvider>
            </AudioFocusProvider>
          </MediaMutedProvider>
        </PhonePlatformProvider>
      </BrowserFeaturesProvider>
    </FocusOutlineProvider>
  );
}
