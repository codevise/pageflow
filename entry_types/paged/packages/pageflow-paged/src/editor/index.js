import {editor} from 'pageflow/editor';

import {PagedEntry} from './models/PagedEntry';

import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';
import './views/PageSelectionView';

editor.registerEntryType('paged', {
  entryModel: PagedEntry,

  previewView: EntryPreviewView,
  outlineView: EntryOutlineView
});

export * from 'pageflow/editor';
