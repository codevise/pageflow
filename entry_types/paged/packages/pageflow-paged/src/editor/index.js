import {editor} from 'pageflow/editor';

import {PagedEntry} from './models/PagedEntry';

import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';
import {EntryMetaDataAppearanceView} from './views/EntryMetaDataAppearanceView';
import './views/PageSelectionView';

editor.registerEntryType('paged', {
  entryModel: PagedEntry,

  previewView: EntryPreviewView,
  outlineView: EntryOutlineView,
  metaDataAppearanceView: EntryMetaDataAppearanceView
});

export * from 'pageflow/editor';
