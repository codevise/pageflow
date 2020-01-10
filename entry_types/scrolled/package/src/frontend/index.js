import React from 'react';
import ReactDOM from 'react-dom';

import AppHeader from './navigation/AppHeader';
import Entry from './Entry';

import './global.module.css';
import {useEntryState, EntryStateProvider} from '../entryState';

export default function Root() {
  const [{entryStructure, entryState}, dispatch] = useEntryState(window.pageflowScrolledSeed);

  return (
    <>
      <EntryStateProvider state={entryState}>
        <AppHeader entryStructure={entryStructure} />
        <Entry entryStructure={entryStructure}
               dispatch={dispatch} />
      </EntryStateProvider>
    </>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
