import React from 'react';

import {Content} from './Content';
import {Widget} from './Widget';

export function Entry() {
  return (
    <>
      <Widget role="consent" />
      <Widget role="header" />
      <Content />
      <Widget role="footer" />
    </>
  )
}
