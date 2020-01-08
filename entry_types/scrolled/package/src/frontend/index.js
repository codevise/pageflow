import React from 'react';
import ReactDOM from 'react-dom';

import AppHeader from './navigation/AppHeader';
import Entry from './Entry';

import './global.module.css';
import {useEntryState} from "../useEntryState";

export default function Root() {
  const [{entryStructure}, dispatch] = useEntryState(window.pageflowScrolledSeed);

  return (
    <>
      <AppHeader />
      <Entry entryStructure={entryStructure}
             dispatch={dispatch} />
    </>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
