import React from 'react';

import {EntryStateProvider} from '../entryState';
import {LocaleProvider} from './i18n';
import {FocusOutlineProvider} from './focusOutline';

export function RootProviders({seed, children}) {
  return (
    <FocusOutlineProvider>
      <EntryStateProvider seed={seed}>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </EntryStateProvider>
    </FocusOutlineProvider>
  );
}
