import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

import {cssModulesUtils, inputView} from 'pageflow/ui';
import {buttonStyles} from 'pageflow-scrolled/editor';

import {EditMotifAreaDialogView} from '../EditMotifAreaDialogView';

import styles from './EditMotifAreaInputView.module.css';

export const EditMotifAreaInputView = Marionette.ItemView.extend({
  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    <button class="${buttonStyles.secondaryIconButton} ${styles.button}">
      <svg class="${styles.icon}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1 h4 M1 1 v4" />
        <path d="M19 1 h-4 M19 1 v4" />
        <path d="M1 19 h4 M1 19 v-4" />
        <path d="M19 19 h-4 M19 19 v-4" />
        <path class="${styles.checkIcon}" d="M5 10 L8.5 13.5 L15 7" />
      </svg>
      <span class="${styles.buttonText}"></span>
    </button>
  `,

  mixins: [inputView],

  ui: cssModulesUtils.ui(styles, 'button', 'buttonText', 'checkIcon'),

  events: {
    'click button': function() {
      EditMotifAreaDialogView.show({
        model: this.model,
        propertyName: this.getPropertyName(),
        file: this.getFile()
      });
    }
  },

  onRender() {
    this.update();
    this.listenTo(
      this.model,
      'change:' + this.getPropertyName() + 'MotifArea',
      this.update
    );
  },

  update() {
    const file = this.getFile();
    const hasMotifArea = !!(file && this.model.get(this.getPropertyName() + 'MotifArea'));
    const key = hasMotifArea ? 'edit' : 'select';

    this.ui.buttonText.text(I18n.t(`pageflow_scrolled.editor.edit_motif_area_input.${key}`));
    this.ui.checkIcon.toggle(hasMotifArea);
  },

  updateDisabled(disabled) {
    this.ui.button.prop('disabled', disabled || !this.getFile());
  },

  getPropertyName() {
    const backdropType = this.model.get('backdropType');

    if (this.options.portrait) {
      return backdropType === 'video' ? 'backdropVideoMobile' : 'backdropImageMobile';
    }
    else {
      return backdropType === 'video' ? 'backdropVideo' : 'backdropImage';
    }
  },

  getFile() {
    const collection = this.model.get('backdropType') === 'video' ? 'video_files' : 'image_files';
    return this.model.getReference(this.getPropertyName(), collection);
  }
});
