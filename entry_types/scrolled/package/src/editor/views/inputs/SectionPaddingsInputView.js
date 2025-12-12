import Marionette from 'backbone.marionette';
import _ from 'underscore';
import I18n from 'i18n-js';
import {editor} from 'pageflow/editor';
import {buttonStyles} from 'pageflow-scrolled/editor';
import {cssModulesUtils, inputView} from 'pageflow/ui';

import paddingTopIcon from '../images/paddingTop.svg';
import paddingBottomIcon from '../images/paddingBottom.svg';
import styles from './SectionPaddingsInputView.module.css';

export const SectionPaddingsInputView = Marionette.Layout.extend({
  mixins: [inputView],

  template: (data) => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    <button class="${buttonStyles.secondaryIconButton} ${styles.button}">
      <div class="${styles.grid}">
        <img src="${paddingTopIcon}" width="18" height="18" />
        <div class="${styles.paddingTop}"></div>
        <div class="${styles.portraitPaddingTop}"></div>
        <img src="${paddingBottomIcon}" width="18" height="18" />
        <div class="${styles.paddingBottom}"></div>
        <div class="${styles.portraitPaddingBottom}"></div>
      </div>
    </button>
  `,

  ui: cssModulesUtils.ui(styles,
                         'paddingTop', 'paddingBottom',
                         'portraitPaddingTop', 'portraitPaddingBottom'),

  events: cssModulesUtils.events(styles, {
    'click button': function () {
      this.options.entry.trigger('selectSectionPaddings', this.model.parent);
      this.options.entry.trigger('scrollToSection', this.model.parent, {ifNeeded: true});
      editor.navigate('/scrolled/sections/' + this.model.parent.get('id') + '/paddings', {trigger: true});
    }
  }),

  onRender() {
    const entry = this.options.entry;

    const [paddingTopValues, paddingTopTexts] = entry.getScale('sectionPaddingTop');
    const [paddingBottomValues, paddingBottomTexts] = entry.getScale('sectionPaddingBottom');

    const paddingTopTextsByValue = Object.fromEntries(_.zip(paddingTopValues, paddingTopTexts));
    const paddingBottomTextsByValue = Object.fromEntries(_.zip(paddingBottomValues, paddingBottomTexts));

    const auto = I18n.t('pageflow_scrolled.editor.section_paddings_input.auto');

    this.ui.paddingTop.text(paddingTopTextsByValue[this.model.get('paddingTop')] || auto);
    this.ui.paddingBottom.text(paddingBottomTextsByValue[this.model.get('paddingBottom')] || auto);
    this.ui.portraitPaddingTop.text(paddingTopTextsByValue[this.model.get('portraitPaddingTop')] || auto);
    this.ui.portraitPaddingBottom.text(paddingBottomTextsByValue[this.model.get('portraitPaddingBottom')] || auto);

    const hasPortrait = this.model.get('portraitPaddingTop') || this.model.get('portraitPaddingBottom')

    this.ui.portraitPaddingTop.toggle(!!hasPortrait);
    this.ui.portraitPaddingBottom.toggle(!!hasPortrait);
  }
});
