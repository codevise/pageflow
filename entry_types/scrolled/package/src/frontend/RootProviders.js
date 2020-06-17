import React from 'react';

import {EntryStateProvider} from '../entryState';
import {LocaleProvider} from './i18n';

export function RootProviders({seed, children}) {
  return (
    <EntryStateProvider seed={seed}>
      <LocaleProvider>
        {children}
      </LocaleProvider>
    </EntryStateProvider>
  );
}
