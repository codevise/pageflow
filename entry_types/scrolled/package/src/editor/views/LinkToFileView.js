import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {FileThumbnailView} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';

import styles from './LinkToFileView.module.css';

export const LinkToFileView = Marionette.ItemView.extend({
  className: styles.view,

  template: () => `
    <div class="${styles.label}">
      ${I18n.t('pageflow_scrolled.editor.select_link_destination.file')}
    </div>
    <div class="${styles.file}">
      <div class="${styles.thumbnail}"></div>
      <div class="${styles.details}">
        <span class="${styles.fileName}"></span>
        <button type="button" class="${styles.selectFileButton}">
          ${I18n.t('pageflow_scrolled.editor.select_link_destination.select_in_sidebar')}
        </button>
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'thumbnail', 'fileName'),

  events: cssModulesUtils.events(styles, {
    'click selectFileButton': function() {
      this.options.onSelectFile();
    }
  }),

  onRender() {
    const file = this.options.file;

    this.appendSubview(new FileThumbnailView({model: file}), {to: this.ui.thumbnail});

    this.ui.fileName
      .text(file ?
            file.title() :
            I18n.t('pageflow_scrolled.editor.select_link_destination.no_file_selected'))
      .toggleClass(styles.blank, !file);
  }
});
