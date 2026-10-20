import I18n from 'i18n-js';
import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {app, editor} from 'pageflow/editor';
import {AccordionView, cssModulesUtils, CheckBoxInputView, TextInputView} from 'pageflow/ui';
import {utils} from 'pageflow-scrolled/frontend';

import {LinkToFileView} from './LinkToFileView';
import {LinkToOtherEntryView} from './LinkToOtherEntryView';
import {SelectableEntryOutlineView} from './SelectableEntryOutlineView';
import {dialogView} from './mixins/dialogView';
import dialogViewStyles from './mixins/dialogView.module.css';
import styles from './SelectLinkDestinationDialogView.module.css';

export const SelectLinkDestinationDialogView = Marionette.ItemView.extend({
  template: data => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles.box}">
        <h1 class="${dialogViewStyles.header}">
          ${data.editing ?
            I18n.t('pageflow_scrolled.editor.select_link_destination.edit_header') :
            I18n.t('pageflow_scrolled.editor.select_link_destination.header')}
        </h1>

        <div class="${styles.accordionContainer}"></div>

        <div class="${styles.footer}">
          ${data.removable ? `
            <button type="button" class="${styles.removeButton}">
              ${I18n.t('pageflow_scrolled.editor.select_link_destination.remove')}
            </button>
          ` : ''}
          <button type="button" class="${styles.createButton}" disabled>
            ${data.editing ?
              I18n.t('pageflow_scrolled.editor.select_link_destination.save') :
              I18n.t('pageflow_scrolled.editor.select_link_destination.create')}
          </button>
          <button type="button" class="${dialogViewStyles.close}">
            ${I18n.t('pageflow_scrolled.editor.select_link_destination.cancel')}
          </button>
        </div>
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'accordionContainer', 'createButton'),

  mixins: [dialogView],

  events: cssModulesUtils.events(styles, {
    'click createButton': function() {
      this.apply(this.link());
    },

    'keydown accordionContainer': function(event) {
      if (event.key === 'Enter' && this.selection.get('kind') === 'url') {
        event.target.dispatchEvent(new Event('change', {bubbles: true}));

        const link = this.link();

        if (link) {
          this.apply(link);
        }
      }
    },

    'click removeButton': function() {
      this.options.onRemove();
      this.close();
    }
  }),

  serializeData() {
    return {
      editing: !!this.options.link,
      removable: !!this.options.link && !!this.options.allowRemove
    };
  },

  initialize() {
    const {href, openInNewTab} = this.options.link || {};

    this.selection = new Backbone.Model({kind: kindOf(href)});
    this.outlineSelection = new Backbone.Model(
      href && kindOf(href) === 'thisEntry' ? _.pick(href, 'chapter', 'section') : {}
    );
    this.otherEntryLink = new Backbone.Model(
      href && href.entry ?
      {entryId: href.entry, signature: href.signature, openInNewTab} :
      {}
    );
    this.otherEntryLink.modelName = 'otherEntryLink';
    this.externalLink = new Backbone.Model(
      typeof href === 'string' ? {url: href, openInNewTab} : {}
    );
    this.externalLink.modelName = 'externalLink';
    this.fileHref = href && href.file;

    this.listenTo(this.selection, 'change', this.updateCreateButton);
    this.listenTo(this.selection, 'change:kind', this.fetchLinkableEntries);
    this.listenTo(this.otherEntryLink, 'change', this.updateCreateButton);
    this.listenTo(this.outlineSelection, 'change', this.updateCreateButton);
    this.listenTo(this.externalLink, 'change', this.updateCreateButton);
  },

  onRender() {
    const dialog = this;
    const accordion = new AccordionView({
      selectionModel: this.selection,
      selectionPropertyName: 'kind'
    });

    accordion.section(sectionTitle('this_entry'), sectionOptions('thisEntry', {fill: true}), function() {
      this.view(OutlineContainerView, {
        outlineView: new SelectableEntryOutlineView({
          entry: dialog.options.entry,

          onSelectChapter: chapter => {
            dialog.outlineSelection.clear({silent: true});
            dialog.outlineSelection.set({chapter: chapter.get('permaId')});
          },
          onSelectSection: section => {
            dialog.outlineSelection.clear({silent: true});
            dialog.outlineSelection.set({section: section.get('permaId')});
          }
        })
      });
    });

    accordion.section(sectionTitle('other_entry'), sectionOptions('otherEntry'), function() {
      this.view(LinkToOtherEntryView, {
        entry: dialog.options.entry,
        model: dialog.otherEntryLink
      });
    });

    accordion.section(sectionTitle('file'), sectionOptions('file'), function() {
      this.view(LinkToFileView, {
        file: dialog.file(),
        onSelectFile: () => dialog.selectFile()
      });
    });

    accordion.section(sectionTitle('url'), sectionOptions('url'), function() {
      this.view(TextInputView, {
        model: dialog.externalLink,
        propertyName: 'url',
        label: I18n.t('pageflow_scrolled.editor.select_link_destination.url'),
        maxLength: 2000
      });
      this.view(CheckBoxInputView, {
        model: dialog.externalLink,
        propertyName: 'openInNewTab',
        label: I18n.t('pageflow_scrolled.editor.select_link_destination.open_in_new_tab')
      });
    });

    this.appendSubview(accordion, {to: this.ui.accordionContainer});
    this.updateCreateButton();
    this.fetchLinkableEntries();
  },

  file() {
    if (!this.fileHref) {
      return null;
    }

    const collectionName = this.fileHref.collectionName.replace(
      /[A-Z]/g, letter => `_${letter.toLowerCase()}`
    );
    const collection = this.options.entry.getFileCollection(collectionName);

    return collection ? collection.getByPermaId(this.fileHref.permaId) : null;
  },

  fetchLinkableEntries() {
    if (this.selection.get('kind') === 'otherEntry' && !this.linkableEntriesFetched) {
      this.linkableEntriesFetched = true;
      this.options.entry.linkableEntries.fetch();
    }
  },

  link() {
    switch (this.selection.get('kind')) {
    case 'thisEntry':
      if (this.outlineSelection.get('chapter')) {
        return {href: {chapter: this.outlineSelection.get('chapter')}};
      }
      else if (this.outlineSelection.get('section')) {
        return {href: {section: this.outlineSelection.get('section')}};
      }
      return null;
    case 'otherEntry':
      return otherEntryLink(this.otherEntryLink.attributes);
    case 'file':
      return this.fileHref ? {href: {file: this.fileHref}} : null;
    case 'url':
      if (!this.externalLink.get('url')) {
        return null;
      }

      return withTarget({href: this.externalLink.get('url')},
                        this.externalLink.get('openInNewTab'));
    default:
      return null;
    }
  },

  updateCreateButton() {
    this.ui.createButton.prop('disabled', !this.link());
  },

  apply(link) {
    const linkableEntry = link.href.entry && this.options.entry.linkableEntries.get(link.href.entry);

    if (linkableEntry) {
      this.options.entry.linkedEntries.addLinkableEntry(linkableEntry);
    }

    this.options.onSelect(link);
    this.close();
  },

  selectFile() {
    currentFileSelectionCallback = (file) => {
      this.options.onSelect({
        href: {
          file: {
            permaId: file.get('perma_id'),
            collectionName: utils.camelize(file.fileType().collectionName)
          }
        }
      });
    };

    editor.selectFile(null, 'linkDestination', {
      label: I18n.t('pageflow_scrolled.editor.select_link_destination.selection_label')
    });
    this.close();
  }
});

SelectLinkDestinationDialogView.show = function(options) {
  const view = new SelectLinkDestinationDialogView(options);
  app.dialogRegion.show(view.render());
};

const OutlineContainerView = Marionette.View.extend({
  className: styles.outlineContainer,

  render() {
    this.appendSubview(this.options.outlineView);
    return this;
  }
});

function kindOf(href) {
  if (typeof href === 'string') {
    return 'url';
  }
  else if (href && href.file) {
    return 'file';
  }
  else if (href && href.entry) {
    return 'otherEntry';
  }

  return 'thisEntry';
}

function otherEntryLink({entryId, signature, openInNewTab}) {
  if (!entryId || !signature) {
    return null;
  }

  return withTarget({href: {entry: entryId, signature}}, openInNewTab);
}

function withTarget(link, openInNewTab) {
  return openInNewTab ? {...link, openInNewTab: true} : link;
}

function sectionTitle(kind) {
  return I18n.t(`pageflow_scrolled.editor.select_link_destination.kinds.${kind}.title`);
}

function sectionOptions(value, options = {}) {
  const kind = value.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  return {
    value,
    description: I18n.t(`pageflow_scrolled.editor.select_link_destination.kinds.${kind}.description`),
    ...options
  };
}

let currentFileSelectionCallback;

const FileSelectionHandler = function(options) {
  this.call = function(file) {
    currentFileSelectionCallback(file)
  };

  this.getReferer = function() {
    return '/';
  };
};

editor.registerFileSelectionHandler(
  'linkDestination',
  FileSelectionHandler
);
