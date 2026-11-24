import {editor} from './api';

import {ScrolledEntry} from './models/ScrolledEntry';
import {ContentElementFileSelectionHandler} from './models/ContentElementFileSelectionHandler';

import {EditDefaultsView} from './views/EditDefaultsView';
import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';

import {SideBarRouter} from './routers/SideBarRouter';
import {SideBarController} from './controllers/SideBarController';

import {browser, features} from 'pageflow/frontend';

import {CheckBoxInputView} from 'pageflow/ui';

import {BrowserNotSupportedView} from './views/BrowserNotSupportedView';

editor.registerEntryType('scrolled', {
  entryModel: ScrolledEntry,

  // Concise methods are not constructable, and the core editor calls
  // `new editor.entryType.previewView(...)`.
  previewView: function(options) {
    return new EntryPreviewView({
      ...options,
      editor
    });
  },
  outlineView: EntryOutlineView,
  editDefaultsView: EditDefaultsView,

  appearanceInputs(tabView) {
    tabView.input('darkWidgets', CheckBoxInputView);
  },

  supportsExtendedFileRights: true,
  supportsFileReferences: true,

  isBrowserSupported() {
    return (browser.agent.matchesDesktopChrome({minVersion: 20}) ||
            browser.agent.matchesDesktopFirefox({minVersion: 20}) ||
            browser.agent.matchesDesktopSafari({minVersion: 3}) ||
            browser.agent.matchesDesktopEdge({minVersion: 20}));
  },
  browserNotSupportedView: BrowserNotSupportedView
});

editor.registerSideBarRouting({
  router: SideBarRouter,
  controller: SideBarController
});

editor.addInitializer(() => {
  if (features.isEnabled('commenting')) {
    editor.registerMainMenuItem({
      translationKey: 'pageflow_scrolled.editor.main_menu.comments',
      path: '/scrolled/comments',
      id: 'comments',
      indicatorAttribute: 'hasUnreadComments'
    });
  }
});

editor.registerFileSelectionHandler('contentElementConfiguration',
                                    ContentElementFileSelectionHandler);

editor.widgetTypes.registerRole('header', {
  isOptional: true
});

editor.widgetTypes.registerRole('scrollIndicator', {
  isOptional: true
});
