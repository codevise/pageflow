/*global pageflow*/

import {ScrolledEntry} from './models/ScrolledEntry';

import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';

import {SideBarRouter} from './routers/SideBarRouter';
import {SideBarController} from './controllers/SideBarController';

import * as globalInterop from 'pageflow/editor';

Object.assign(pageflow, globalInterop);

pageflow.editor.registerEntryType('scrolled', {
  entryModel: ScrolledEntry,

  previewView: EntryPreviewView,
  outlineView: EntryOutlineView
});

pageflow.editor.registerSideBarRouting({
  router: SideBarRouter,
  controller: SideBarController
});
