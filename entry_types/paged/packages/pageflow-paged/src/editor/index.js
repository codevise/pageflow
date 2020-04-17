import {editor} from 'pageflow/editor';

import {PagedEntry} from './models/PagedEntry';


import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';
import {appearanceInputs} from './helpers/appearanceInputs';
import './views/PageSelectionView';

import {SideBarRouter} from './routers/SideBarRouter';
import {SideBarController} from './controllers/SideBarController';

import './views/configurationEditors/audio';
import './views/configurationEditors/backgroundImage';
import './views/configurationEditors/video';
import './views/configurationEditors/groups/background';
import './views/configurationEditors/groups/general';
import './views/configurationEditors/groups/pageLink';
import './views/configurationEditors/groups/pageTransitions';
import './views/configurationEditors/groups/options';

import './initializers/setupHotkeys'
import './initializers/setupIndicators'
import './initializers/stylesheetReloading'

export * from './views/inputs/PageLinkInputView';

export * from 'pageflow/editor';
export * from './models/PreviewEntryData';

editor.registerEntryType('paged', {
  entryModel: PagedEntry,

  previewView: EntryPreviewView,
  outlineView: EntryOutlineView,
  appearanceInputs: appearanceInputs
});

editor.registerSideBarRouting({
  router: SideBarRouter,
  controller: SideBarController
});
