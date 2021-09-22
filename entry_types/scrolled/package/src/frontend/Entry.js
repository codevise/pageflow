import React from 'react';

import {ConsentBar} from './thirdPartyConsent';
import {AppHeader} from './navigation/AppHeader';
import {Content} from './Content';

export function Entry() {
  return (
    <>
      <ConsentBar />
      <AppHeader />
      <Content />
    </>
  )
}
