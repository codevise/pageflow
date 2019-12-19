import {editor} from 'pageflow/editor';

import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';
import './views/PageSelectionView';

editor.registerEntryType('paged', {
  previewView: EntryPreviewView,
  outlineView: EntryOutlineView
});

export * from 'pageflow/editor';
