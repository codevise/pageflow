import {editor} from './api';

import {ScrolledEntry} from './models/ScrolledEntry';
import {ContentElementFileSelectionHandler} from './models/ContentElementFileSelectionHandler';

import {EntryOutlineView} from './views/EntryOutlineView';
import {EntryPreviewView} from './views/EntryPreviewView';

import {SideBarRouter} from './routers/SideBarRouter';
import {SideBarController} from './controllers/SideBarController';

import {browser} from 'pageflow/frontend';

import {
  CheckBoxInputView,
  ConfigurationEditorView,
  SelectInputView,
  SeparatorView,
  TextInputView
} from 'pageflow/ui';

import {ColorSelectInputView} from './views/inputs/ColorSelectInputView';
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
    tabView.input('darkWidgets', CheckBoxInputView);
  },

  supportsExtendedFileRights: true,

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

editor.widgetTypes.registerRole('scrollIndicator', {
  isOptional: true
});

editor.widgetTypes.register('defaultNavigation', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function() {
      const [values, texts] = this.options.entry.getPaletteColors({name: 'accentColors'});

      this.tab('defaultNavigation', function() {
        if (values.length) {
          this.input('accentColor', ColorSelectInputView, {
            includeBlank: true,
            blankTranslationKey: 'pageflow_scrolled.editor.' +
                                 'common_content_element_attributes.' +
                                 'palette_color.blank',
            values,
            texts,
          });
        }

        this.input('hideToggleMuteButton', CheckBoxInputView);
        this.input('hideSharingButton', CheckBoxInputView);
        this.input('fixedOnDesktop', CheckBoxInputView);
      });
    }
  })
});

editor.widgetTypes.register('textInlineFileRights', {
  configurationEditorTabViewGroups: {
    ContentElementInlineFileRightsSettings: function({disableWhenNoFileRights = true}) {
      this.input('showTextInlineFileRightsBackdrop', CheckBoxInputView, {
        disabledBindingModel: this.model.parent.transientState,
        disabledBinding: 'hasFileRights',
        disabled: hasFileRights => disableWhenNoFileRights && !hasFileRights,
        displayUncheckedIfDisabled: true,
        attributeTranslationKeyPrefixes: [
          'pageflow_scrolled.editor.content_element_text_inline_file_rights_attributes'
        ],
      });
    }
  }
});

editor.widgetTypes.register('iconScrollIndicator', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function() {
      const firstSection = this.options.entry.sections.first();

      if (firstSection) {
        this.options.entry.trigger('scrollToSection', firstSection);
      }

      this.tab('iconScrollIndicator', function() {
        this.input('alignment', SelectInputView, {
          values: ['centerContent', 'centerViewport']
        });
        this.input('size', SelectInputView, {
          defaultValue: 'small',
          values: ['large', 'small']
        });
        this.input('animation', SelectInputView, {
          defaultValue: 'smallBounce',
          values: ['none', 'smallBounce', 'largeBounce']
        });

      });
    }
  })
});

editor.widgetTypes.register('excursionSheet', {
  configurationEditorTabViewGroups: {
    ChapterExcursionSettings: function() {
      this.view(SeparatorView);
      this.input('returnButtonLabel', TextInputView);
    }
  }
});
