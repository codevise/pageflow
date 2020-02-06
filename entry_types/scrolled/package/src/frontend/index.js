import React from 'react';
import ReactDOM from 'react-dom';

import {AppHeader} from './navigation/AppHeader';
import Entry from './Entry';

import './global.module.css';
import {EntryStateProvider} from '../entryState';


export * from './Image';
export * from './Text';
export * from './Video';

export * from './useOnScreen';

export * from './SectionThumbnail';

window.pageflowScrolledRender = function(seed) {
  ReactDOM.render(<Root seed={seed} />, document.getElementById('root'));
}

function Root({seed}) {
  return (
    <>
      <EntryStateProvider seed={seed}>
        <AppHeader />
        <Entry />
      </EntryStateProvider>
    </>
  );
}
