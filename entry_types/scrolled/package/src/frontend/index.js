import React from 'react';
import ReactDOM from 'react-dom';

import AppHeader from './navigation/AppHeader';
import Entry from './Entry';

import './global.module.css';
import {EntryStateProvider} from '../entryState';

export default function Root() {
  return (
    <>
      <EntryStateProvider seed={window.pageflowScrolledSeed}>
        <AppHeader />
        <Entry />
      </EntryStateProvider>
    </>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
