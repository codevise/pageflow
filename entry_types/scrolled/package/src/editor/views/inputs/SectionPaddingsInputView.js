import Marionette from 'backbone.marionette';
import _ from 'underscore';
import I18n from 'i18n-js';
import {editor} from 'pageflow/editor';
import {buttonStyles} from 'pageflow-scrolled/editor';
import {cssModulesUtils, inputView} from 'pageflow/ui';

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
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-unfold-vertical-icon lucide-unfold-vertical"><path d="M12 22v-6"></path><path d="M4 12H2"></path><path d="M10 12H8"></path><path d="M16 12h-2"></path><path d="M22 12h-2"></path><path d="m15 19-3 3-3-3"></path></svg>


        <div class="${styles.paddingTop}"></div>
        <div class="${styles.portraitPaddingTop}"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-unfold-vertical-icon lucide-unfold-vertical"><path d="M12 8V2"></path><path d="M4 12H2"></path><path d="M10 12H8"></path><path d="M16 12h-2"></path><path d="M22 12h-2"></path><path d="m15 5-3-3-3 3"></path></svg>
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
