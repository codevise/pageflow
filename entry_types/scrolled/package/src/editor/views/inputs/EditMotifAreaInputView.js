import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

import {cssModulesUtils, inputView} from 'pageflow/ui';
import {buttonStyles} from 'pageflow-scrolled/editor';

import {EditMotifAreaDialogView} from '../EditMotifAreaDialogView';

import styles from './EditMotifAreaInputView.module.css';

export const EditMotifAreaInputView = Marionette.ItemView.extend({
  template: (data) => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    ${data.infoText ? `<div class="${styles.infoText}">${data.infoText}</div>` : ''}
    <button class="${data.showIgnoreOption ? buttonStyles.primaryIconButton : buttonStyles.secondaryIconButton} ${styles.button}">
      <svg class="${styles.icon}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1 h4 M1 1 v4" />
        <path d="M19 1 h-4 M19 1 v4" />
        <path d="M1 19 h4 M1 19 v-4" />
        <path d="M19 19 h-4 M19 19 v-4" />
        <path class="${styles.checkIcon}" d="M5 10 L8.5 13.5 L15 7" />
      </svg>
      <span class="${styles.buttonText}"></span>
    </button>
    ${data.showIgnoreOption ? `
    <button class="${buttonStyles.secondaryIconButton} ${styles.ignoreButton}">
      <svg class="${styles.ignoreIcon}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 5 L15 15 M15 5 L5 15" />
      </svg>
      <span>${data.ignoreButtonText}</span>
    </button>
    ` : ''}
  `,

  mixins: [inputView],

  initialize() {
    this.backdrop = this.model.getBackdrop();

    this.listenTo(this.backdrop, 'change:motifArea', this.update);
    this.listenTo(this.backdrop, 'change:ignoreMissingMotif', this.update);
    this.listenTo(this.backdrop, 'change:type', this.render);
  },

  serializeData() {
    const ignoreButtonTextKey = this.model.get('backdropType') === 'video' ? 'ignore_video' : 'ignore_image';

    return {
      infoText: this.options.infoText,
      showIgnoreOption: this.options.showIgnoreOption,
      ignoreButtonText: I18n.t(`pageflow_scrolled.editor.edit_motif_area_input.${ignoreButtonTextKey}`)
    };
  },

  ui: cssModulesUtils.ui(styles, 'button', 'buttonText', 'checkIcon', 'ignoreButton'),

  events: cssModulesUtils.events(styles, {
    'click button': function() {
      const portrait = this.options.portrait;

      EditMotifAreaDialogView.show({
        model: this.model,
        propertyName: this.backdrop.getFilePropertyName({portrait}),
        file: this.backdrop.getFile({portrait})
      });
    },
    'click ignoreButton': function() {
      const file = this.backdrop.getFile({portrait: this.options.portrait});

      if (file) {
        file.configuration.set('ignoreMissingMotif', true);
        this.updateVisibility();
      }
    }
  }),

  onRender() {
    this.$el.addClass(styles[`highlight-${this.options.highlight}`]);

    this.update();
    this.updateVisibility();
  },

  update() {
    if (this.isClosed) {
      return;
    }

    const status = this.backdrop.getMotifAreaStatus({portrait: this.options.portrait});

    const hasMotifArea = status === 'defined';
    const showWarning = this.options.required && (status === 'missing' || status === 'ignored');

    const key = hasMotifArea ? 'edit' : (showWarning ? 'warn' : 'select');

    this.ui.buttonText.text(I18n.t(`pageflow_scrolled.editor.edit_motif_area_input.${key}`));
    this.ui.checkIcon.toggle(hasMotifArea);
    this.ui.button.toggleClass(styles.warning, !!showWarning);
    this.updateVisibility();
  },

  updateDisabled(disabled) {
    this.ui.button.prop('disabled', disabled || !this.backdrop.getFile({portrait: this.options.portrait}));
  },

  updateVisibility() {
    if (this.options.onlyShowWhenMissing) {
      this.$el.toggleClass(styles.hidden, this.backdrop.getMotifAreaStatus({portrait: this.options.portrait}) !== 'missing');
    }
  }
});
