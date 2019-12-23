/*global pageflow*/

import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';

import * as globalInterop from 'pageflow/editor';

Object.assign(pageflow, globalInterop);

pageflow.editor.registerEntryType('scrolled', {
  previewView: EntryPreviewView,
  outlineView: EntryOutlineView
});
