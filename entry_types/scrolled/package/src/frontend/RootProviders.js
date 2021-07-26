import React from 'react';

import {BrowserFeaturesProvider} from './useBrowserFeature';
import {EntryStateProvider} from '../entryState';
import {FocusOutlineProvider} from './focusOutline';
import {LocaleProvider} from './i18n';
import {PhonePlatformProvider} from './PhonePlatformProvider';
import {MediaMutedProvider} from './useMediaMuted';
import {AudioFocusProvider} from './useAudioFocus';
import {ConsentProvider} from './thirdPartyConsent';

export function RootProviders({seed, consent, children}) {
  return (
    <FocusOutlineProvider>
      <BrowserFeaturesProvider>
        <PhonePlatformProvider>
          <MediaMutedProvider>
            <AudioFocusProvider>
              <EntryStateProvider seed={seed}>
                <LocaleProvider>
                  <ConsentProvider consent={consent}>
                    {children}
                  </ConsentProvider>
                </LocaleProvider>
              </EntryStateProvider>
            </AudioFocusProvider>
          </MediaMutedProvider>
        </PhonePlatformProvider>
      </BrowserFeaturesProvider>
    </FocusOutlineProvider>
  );
}
