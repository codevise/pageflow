import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom';

import {AppHeader} from './navigation/AppHeader';
import Entry from './Entry';
import {setupI18n} from './i18n';

import './global.module.css';
import {EntryStateProvider} from '../entryState';
import {EditorStateProvider} from './EditorState';
import {loadInlineEditingComponents} from './inlineEditing';

const editMode = window.location.pathname.indexOf('/editor/entries') === 0;

export {api as frontend} from './api';

export * from './Image';
export * from './InlineCaption';
export * from './Text';

export * from './MediaPlayer';
export * from './VideoPlayer';
export * from './AudioPlayer';

export * from './useOnScreen';
export * from './useMediaSettings';
export * from './i18n';

export * from './SectionThumbnail';
export {default as Entry} from './Entry';
export {EntryStateProvider, useFile} from '../entryState'
export {useEditorSelection} from './EditorState';

window.pageflowScrolledRender = function(seed) {
  setupI18n(seed.i18n);

  if (editMode) {
    loadInlineEditingComponents().then(() => render(seed));
  }
  else {
    render(seed);
  }
}

function render(seed) {
  ReactDOM.render(<Root seed={seed} />, document.getElementById('root'));
}

function Root({seed}) {
  return (
    <>
      <EditorStateProvider active={editMode}>
        <EntryStateProvider seed={seed}>
          <AppHeader />
          <Entry />
        </EntryStateProvider>
      </EditorStateProvider>
    </>
  );
}
