import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {cssModulesUtils, CheckBoxInputView} from 'pageflow/ui';

import {EntrySelectView} from './EntrySelectView';
import {SelectableEntryOutlineView} from './SelectableEntryOutlineView';
import styles from './LinkToOtherEntryView.module.css';

export const LinkToOtherEntryView = Marionette.ItemView.extend({
  className: styles.view,

  template: () => `
    <p class="${styles.inaccessibleEntryNotice}" hidden></p>
    <div class="${styles.entrySelectContainer}"></div>
    <div class="${styles.openInNewTabContainer}"></div>
    <button type="button"
            class="${styles.expandButton}"
            aria-expanded="false"
            hidden>
      ${I18n.t('pageflow_scrolled.editor.select_link_destination.link_to_chapter_or_section')}
    </button>
    <div class="${styles.outlineContainer}" hidden></div>
    <button type="button" class="${styles.collapseButton}" hidden>
      ${I18n.t('pageflow_scrolled.editor.select_link_destination.link_to_beginning_of_entry')}
    </button>
  `,

  ui: cssModulesUtils.ui(styles,
                         'inaccessibleEntryNotice',
                         'entrySelectContainer',
                         'openInNewTabContainer',
                         'expandButton',
                         'outlineContainer',
                         'collapseButton'),

  events: cssModulesUtils.events(styles, {
    'click expandButton': function() {
      this.expandOutline();
    },

    'click collapseButton': function() {
      this.collapseOutline();
    }
  }),

  initialize() {
    this.listenTo(this.options.entry.linkableEntries, 'sync', this.handleLinkableEntriesSync);
  },

  onRender() {
    const linkableEntries = this.options.entry.linkableEntries;

    this.appendSubview(new EntrySelectView({
      collection: linkableEntries,
      selectedEntryId: this.model.get('entryId'),
      label: I18n.t('pageflow_scrolled.editor.select_link_destination.story'),
      onSelect: linkableEntry => this.selectEntry(linkableEntry)
    }), {to: this.ui.entrySelectContainer});

    this.appendSubview(new CheckBoxInputView({
      model: this.model,
      propertyName: 'openInNewTab',
      label: I18n.t('pageflow_scrolled.editor.select_link_destination.open_in_new_tab')
    }), {to: this.ui.openInNewTabContainer});

    if (this.model.get('entryId') && this.model.get('expanded')) {
      this.ui.outlineContainer.prop('hidden', false);
      this.options.onToggleOutline(true);
      this.loadOutline();
    }

    this.updateButtons();
  },

  selectEntry(linkableEntry) {
    if (linkableEntry && linkableEntry.id === this.model.get('entryId')) {
      return;
    }

    this.model.unset('chapter');
    this.model.unset('section');
    this.model.unset('targetSignature');
    this.model.set({
      entryId: linkableEntry?.id,
      signature: linkableEntry?.get('signature')
    });

    if (!this.hasOutline()) {
      this.collapseOutline();
    }
    else if (this.model.get('expanded')) {
      this.loadOutline();
    }

    this.updateInaccessibleEntryNotice();
    this.updateButtons();
  },

  handleLinkableEntriesSync() {
    const linkableEntry = this.linkableEntry();

    if (linkableEntry) {
      if (!this.model.get('signature')) {
        this.model.set('signature', linkableEntry.get('signature'));
      }

      if (this.model.get('expanded') && this.outlineEntryId !== linkableEntry.id) {
        this.loadOutline();
      }
    }
    else if (this.model.get('expanded')) {
      this.ui.outlineContainer.prop('hidden', true);
      this.options.onToggleOutline(false);
    }

    this.updateInaccessibleEntryNotice();
    this.updateButtons();
  },

  expandOutline() {
    this.model.set('expanded', true);
    this.ui.outlineContainer.prop('hidden', false);
    this.options.onToggleOutline(true);
    this.updateButtons();
    this.loadOutline();
  },

  collapseOutline() {
    this.model.set('expanded', false);
    this.model.unset('chapter');
    this.model.unset('section');
    this.model.unset('targetSignature');
    this.ui.outlineContainer.prop('hidden', true);
    this.closeOutline();
    this.options.onToggleOutline(false);
    this.updateButtons();
  },

  updateButtons() {
    const expanded = !!this.model.get('expanded');

    this.ui.expandButton.prop('hidden', expanded || !this.hasOutline());
    this.ui.expandButton.attr('aria-expanded', String(expanded));
    this.ui.collapseButton.prop('hidden', !expanded || !this.linkableEntry());
  },

  updateInaccessibleEntryNotice() {
    const linkedEntry = this.options.entry.linkedEntries.get(this.model.get('entryId'));
    const inaccessible = !!linkedEntry && !this.linkableEntry();

    this.ui.inaccessibleEntryNotice.prop('hidden', !inaccessible);
    this.ui.inaccessibleEntryNotice.text(inaccessible ?
      I18n.t('pageflow_scrolled.editor.select_link_destination.inaccessible_entry',
             {title: linkedEntry.get('title')}) :
      '');
  },

  hasOutline() {
    return this.linkableEntry()?.get('typeName') === 'scrolled';
  },

  linkableEntry() {
    return this.options.entry.linkableEntries.get(this.model.get('entryId'));
  },

  loadOutline() {
    const linkableEntry = this.linkableEntry();
    this.closeOutline();
    this.outlineEntryId = linkableEntry?.id;

    if (!linkableEntry) {
      return;
    }

    const request = this.outlineRequest = {};

    linkableEntry.fetchOutline({entry: this.options.entry}).then(
      outline => {
        if (this.isCurrentOutlineRequest(request)) {
          this.showOutline(outline, linkableEntry);
        }
      },
      () => {
        if (this.isCurrentOutlineRequest(request)) {
          this.showOutlineError();
        }
      }
    );
  },

  isCurrentOutlineRequest(request) {
    return this.outlineRequest === request && !this.isClosed;
  },

  showOutline(outline, linkableEntry) {
    this.outlineView = this.subview(new SelectableEntryOutlineView({
      entry: outline,
      selection: this.model,

      onSelectChapter: chapter => {
        this.model.unset('section');
        this.model.set({
          chapter: chapter.get('permaId'),
          targetSignature: linkableEntry.chapterLinkSignature(chapter.get('permaId'))
        });
      },
      onSelectSection: section => {
        this.model.unset('chapter');
        this.model.set({
          section: section.get('permaId'),
          targetSignature: linkableEntry.sectionLinkSignature(section.get('permaId'))
        });
      }
    }));

    this.ui.outlineContainer.append(this.outlineView.el);
  },

  showOutlineError() {
    this.ui.outlineContainer.append(
      `<p class="${styles.outlineError}">
         ${I18n.t('pageflow_scrolled.editor.select_link_destination.outline_failed')}
       </p>`
    );
  },

  closeOutline() {
    this.outlineRequest = null;

    if (this.outlineView) {
      this.outlineView.close();
      this.outlineView = null;
    }

    this.ui.outlineContainer.empty();
  }
});
