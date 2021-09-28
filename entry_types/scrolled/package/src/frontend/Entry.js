import React from 'react';

import {ConsentBar} from './thirdPartyConsent';
import {Content} from './Content';
import {Widget} from './Widget';

export function Entry() {
  return (
    <>
      <ConsentBar />
      <Widget role="header" />
      <Content />
      <Widget role="footer" />
    </>
  )
}
