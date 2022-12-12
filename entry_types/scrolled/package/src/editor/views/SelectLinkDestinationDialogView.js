import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {app} from 'pageflow/editor';
import {cssModulesUtils, CheckBoxInputView, TextInputView} from 'pageflow/ui';

import {SelectableEntryOutlineView} from './SelectableEntryOutlineView';
import {dialogView} from './mixins/dialogView';
import dialogViewStyles from './mixins/dialogView.module.css';
import styles from './SelectLinkDestinationDialogView.module.css';

export const SelectLinkDestinationDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles.box}">
        <h1 class="${dialogViewStyles.header}">${I18n.t('pageflow_scrolled.editor.select_link_destination.header')}</h1>

        <div class="${styles.urlContainer} configuration_editor_tab">
          <div><button class="${styles.createButton}">
            ${I18n.t('pageflow_scrolled.editor.select_link_destination.create')}
          </button></div>
        </div>

        <div class="${styles.or}">
          ${I18n.t('pageflow_scrolled.editor.select_link_destination.or')}
        </div>
        <label><span class="name">
          ${I18n.t('pageflow_scrolled.editor.select_link_destination.select_chapter_or_section')}
        </span></label>
        <div class="${styles.outlineContainer}"></div>

        <div class="${dialogViewStyles.footer}">
          <button class="${dialogViewStyles.close} ${styles.close}">
            ${I18n.t('pageflow_scrolled.editor.select_link_destination.cancel')}
          </button>
        </div>
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'urlContainer', 'outlineContainer'),

  mixins: [dialogView],

  events: cssModulesUtils.events(styles, {
    'click createButton': function() {
      const link = {href: this.externalLink.get('url')};

      if (this.externalLink.get('openInNewTab')) {
        link.openInNewTab = true;
      }

      this.options.onSelect(link);
      this.close();
    }
  }),

  onRender() {
    this.externalLink = new Backbone.Model();
    this.externalLink.modelName = 'externalLink';

    this.ui.urlContainer.prepend(
      this.subview(new CheckBoxInputView({
        model: this.externalLink,
        propertyName: 'openInNewTab',
        label: I18n.t('pageflow_scrolled.editor.select_link_destination.open_in_new_tab')
      })).el
    );

    this.ui.urlContainer.prepend(
      this.subview(new TextInputView({
        model: this.externalLink,
        propertyName: 'url',
        label: I18n.t('pageflow_scrolled.editor.select_link_destination.enter_url')
      })).el
    );

    this.ui.outlineContainer.append(
      this.subview(new SelectableEntryOutlineView({
        entry: this.options.entry,

        onSelectChapter: chapter => {
          this.options.onSelect({href: {chapter: chapter.get(`permaId`)}});
          this.close();
        },
        onSelectSection: section => {
          this.options.onSelect({href: {section: section.get(`permaId`)}});
          this.close();
        }
      })).el
    );
  },

  onClose() {
    if (this.options.onAbort) {
      this.options.onAbort();
    }
  }
});

SelectLinkDestinationDialogView.show = function(options) {
  const view = new SelectLinkDestinationDialogView(options);
  app.dialogRegion.show(view.render());
};
