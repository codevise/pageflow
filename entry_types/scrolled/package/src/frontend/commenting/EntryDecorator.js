import React from 'react';

import {FloatingToolbar} from './FloatingToolbar';

export function EntryDecorator(props) {
  return (
    <>
      {props.children}
      <FloatingToolbar />
    </>
  );
}
