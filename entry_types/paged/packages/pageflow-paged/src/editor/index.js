import {editor, app} from 'pageflow/editor';

import {PagedEntry} from './models/PagedEntry';
import {PreviewEntryData} from './models/PreviewEntryData';


import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';
import {appearanceInputs} from './helpers/appearanceInputs';
import './views/PageSelectionView';
import {state} from '../frontend/state';

export * from 'pageflow/editor';
export * from './models/PreviewEntryData';

state.createEntryData = function () {
  state.entryData = new PreviewEntryData({
    entry: state.entry,
    storylines: state.storylines,
    chapters: state.chapters,
    pages: state.pages
  });
}

editor.registerEntryType('paged', {
  entryModel: PagedEntry,

  previewView: EntryPreviewView,
  outlineView: EntryOutlineView,
  appearanceInputs: appearanceInputs
});
