import {editor} from './api';

import {ScrolledEntry} from './models/ScrolledEntry';
import {ContentElementFileSelectionHandler} from './models/ContentElementFileSelectionHandler';

import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';

import {SideBarRouter} from './routers/SideBarRouter';
import {SideBarController} from './controllers/SideBarController';

import {browser} from 'pageflow/frontend';
import {CheckBoxInputView, ConfigurationEditorView} from 'pageflow/ui';
import {BrowserNotSupportedView} from './views/BrowserNotSupportedView';

editor.registerEntryType('scrolled', {
  entryModel: ScrolledEntry,

  previewView(options) {
    return new EntryPreviewView({
      ...options,
      editor
    });
  },
  outlineView: EntryOutlineView,

  appearanceInputs(tabView) {
  },

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

editor.registerFileSelectionHandler('contentElementConfiguration',
                                    ContentElementFileSelectionHandler);

editor.widgetTypes.registerRole('header', {
  isOptional: true
});

editor.widgetTypes.register('defaultNavigation', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function() {
      this.tab('defaultNavigation', function() {
        this.input('hideToggleMuteButton', CheckBoxInputView);
        this.input('hideSharingButton', CheckBoxInputView);
        this.input('fixedOnDesktop', CheckBoxInputView);
      });
    }
  })
});
