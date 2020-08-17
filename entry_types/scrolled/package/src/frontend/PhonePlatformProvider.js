import React from 'react';

import PhonePlatformContext from './PhonePlatformContext';
import {browser} from 'pageflow/frontend';

import {withInlineEditingAlternative} from './inlineEditing';

export const PhonePlatformProvider = withInlineEditingAlternative('PhonePlatformProvider', function PhonePlatformProvider({children}) {

  const isPhonePlatform = browser.has('phone platform')

  return (
    <PhonePlatformContext.Provider value={isPhonePlatform} >
      {children}
    </PhonePlatformContext.Provider>
  );
});
