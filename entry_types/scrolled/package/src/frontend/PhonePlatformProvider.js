import React from 'react';

import PhonePlatformContext from './PhonePlatformContext';
import {browser} from 'pageflow/frontend';

import {withInlineEditingAlternative} from './inlineEditing';

export const PhonePlatformProvider = withInlineEditingAlternative('PhonePlatformProvider', function PhonePlatformProvider({children}) {

  var isPhonePlatform = false;
  if (browser.has('phone platform')) {
    isPhonePlatform = true;
  }

  return (
    <PhonePlatformContext.Provider value={isPhonePlatform} >
      {children}
    </PhonePlatformContext.Provider>
  );
});
