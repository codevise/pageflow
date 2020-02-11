import React from 'react';
import ReactDOM from 'react-dom';

import {AppHeader} from './navigation/AppHeader';
import Entry from './Entry';

import './global.module.css';
import {EntryStateProvider} from '../entryState';

export {api as frontend} from './api';

export * from './Image';
export * from './Text';
export * from './Video';

export * from './useOnScreen';
export * from './useMediaSettings';

export * from './SectionThumbnail';
export {default as Entry} from './Entry';
export {EntryStateProvider} from '../entryState/EntryStateProvider'

import I18n from 'i18n-js';
window.I18n = I18n;

window.pageflowScrolledRender = function(seed) {
  I18n.translations = I18n.translations || {};
  I18n.translations[I18n.locale] = seed.translations;
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
