import React from 'react';

import {PhonePlatformContext} from './PhonePlatformContext';
import {useBrowserFeature} from './useBrowserFeature';

import {extensible} from './extensions';

export const PhonePlatformProvider = extensible('PhonePlatformProvider', function PhonePlatformProvider({children}) {
  const isPhonePlatform = useBrowserFeature('phone platform')

  return (
    <PhonePlatformContext.Provider value={isPhonePlatform}>
      {children}
    </PhonePlatformContext.Provider>
  );
});
