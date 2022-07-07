import React from 'react';

import {consent as consentApi} from 'pageflow/frontend';

import {BrowserFeaturesProvider} from './useBrowserFeature';
import {EntryStateProvider} from '../entryState';
import {FocusOutlineProvider} from './focusOutline';
import {LocaleProvider} from './i18n';
import {PhonePlatformProvider} from './PhonePlatformProvider';
import {MediaMutedProvider} from './useMediaMuted';
import {AudioFocusProvider} from './useAudioFocus';
import {ConsentProvider} from './thirdPartyConsent';
import {CurrentSectionProvider} from './useCurrentChapter';

export function RootProviders({seed, consent = consentApi, children}) {
  return (
    <FocusOutlineProvider>
      <BrowserFeaturesProvider>
        <PhonePlatformProvider>
          <MediaMutedProvider>
            <AudioFocusProvider>
              <EntryStateProvider seed={seed}>
                <CurrentSectionProvider>
                  <LocaleProvider>
                    <ConsentProvider consent={consent}>
                      {children}
                    </ConsentProvider>
                  </LocaleProvider>
                </CurrentSectionProvider>
              </EntryStateProvider>
            </AudioFocusProvider>
          </MediaMutedProvider>
        </PhonePlatformProvider>
      </BrowserFeaturesProvider>
    </FocusOutlineProvider>
  );
}
