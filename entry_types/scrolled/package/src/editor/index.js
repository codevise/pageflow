/*global pageflow*/

import {BlankView} from './views/BlankView';
import {EntryPreviewView} from './views/EntryPreviewView';

import * as globalInterop from 'pageflow/editor';

Object.assign(pageflow, globalInterop);

pageflow.editor.registerEntryType('scrolled', {
  previewView: EntryPreviewView,
  outlineView: BlankView
});
