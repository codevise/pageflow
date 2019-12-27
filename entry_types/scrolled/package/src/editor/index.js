/*global pageflow*/

import {ScrolledEntry} from './models/ScrolledEntry';

import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';

import * as globalInterop from 'pageflow/editor';

Object.assign(pageflow, globalInterop);

pageflow.editor.registerEntryType('scrolled', {
  entryModel: ScrolledEntry,

  previewView: EntryPreviewView,
  outlineView: EntryOutlineView
});
