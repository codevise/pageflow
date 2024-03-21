import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

import {cssModulesUtils, inputView} from 'pageflow/ui';

import {InsertContentElementDialogView} from '../InsertContentElementDialogView'

import styles from './BackdropContentElementInputView.module.css';

export const BackdropContentElementInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  className: styles.view,

  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    <div class="${styles.container}">
      <button class="${styles.navigate}">
        <span class="${styles.typePictogramBg}">
          <img class="${styles.typePictogram}" width="20" height="20" />
        </span>
        <span class="${styles.name}"></span>
      </button>
      <button class="${styles.unset}"
              title="${I18n.t('pageflow_scrolled.editor.backdrop_content_element_input.unset')}"></button>
      <button class="${styles.add}">
        ${I18n.t('pageflow_scrolled.editor.backdrop_content_element_input.add')}
      </button>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'typePictogram', 'navigate', 'name'),

  events: cssModulesUtils.events(styles, {
    'click add': function() {
      InsertContentElementDialogView.show({
        entry: this.options.entry,
        editor: this.options.editor,
        insertOptions: {at: 'backdropOfSection', id: this.model.parent.id}
      });
      this.options.entry.trigger('scrollToSection', this.model.parent, {align: 'start'});
    },

    'click navigate': function() {
      this.options.editor.navigate(
        `/scrolled/content_elements/${this.contentElement.id}`,
        {trigger: true}
      );
      this.options.entry.trigger('selectContentElement', this.contentElement);
      this.options.entry.trigger('scrollToSection', this.model.parent, {align: 'start'});
    },

    'click unset': function() {
      this.contentElement.configuration.set('position', 'inline', {keepBackdropType: true});
      this.update();
    }
  }),

  onRender() {
    this.update();
  },

  update() {
    this.contentElement = this.model.parent.getBackdropContentElement();

    this.$el.toggleClass(styles.present, !!this.contentElement);

    if (this.contentElement) {
      this.ui.name.text(this.contentElement.getType().displayName);
      this.ui.typePictogram.attr('src', this.contentElement.getType().pictogram);
    }
  }
});
