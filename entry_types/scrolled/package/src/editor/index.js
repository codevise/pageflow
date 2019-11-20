import {editor, startEditor} from 'pageflow/editor';

import {BlankView} from './views/BlankView';

import * as globalInterop from 'pageflow/editor';

editor.registerEntryType('scrolled', {
  previewView: BlankView,
  outlineView: BlankView
});

Object.assign(pageflow, globalInterop);
