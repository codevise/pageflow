/*global pageflow*/

import {BlankView} from './views/BlankView';
import * as globalInterop from 'pageflow/editor';

Object.assign(pageflow, globalInterop);

pageflow.editor.registerEntryType('scrolled', {
  previewView: BlankView,
  outlineView: BlankView
});

