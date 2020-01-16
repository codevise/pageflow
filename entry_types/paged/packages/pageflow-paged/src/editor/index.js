import {editor} from 'pageflow/editor';

import {PagedEntry} from './models/PagedEntry';

import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';
import {appearanceInputs} from './helpers/appearanceInputs';
import './views/PageSelectionView';

editor.registerEntryType('paged', {
  entryModel: PagedEntry,

  previewView: EntryPreviewView,
  outlineView: EntryOutlineView,
  appearanceInputs: appearanceInputs
});

export * from 'pageflow/editor';
