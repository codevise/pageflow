import React from 'react';

import PhonePlatformContext from './PhonePlatformContext';
import {useBrowserFeature} from './useBrowserFeature';

import {withInlineEditingAlternative} from './inlineEditing';

export const PhonePlatformProvider = withInlineEditingAlternative('PhonePlatformProvider', function PhonePlatformProvider({children}) {
  const isPhonePlatform = useBrowserFeature('phone platform')

  return (
    <PhonePlatformContext.Provider value={isPhonePlatform}>
      {children}
    </PhonePlatformContext.Provider>
  );
});
