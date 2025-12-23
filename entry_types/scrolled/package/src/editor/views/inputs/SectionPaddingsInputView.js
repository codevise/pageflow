import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
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

    const paddingTopScale = entry.getScale('sectionPaddingTop');
    const paddingBottomScale = entry.getScale('sectionPaddingBottom');

    const paddingTopText = getValueText(paddingTopScale, this.model.get('paddingTop'));
    const motifPrefix = I18n.t('pageflow_scrolled.editor.section_paddings_input.motif');

    const portraitPaddingTopText = getValueText(paddingTopScale, this.model.get('portraitPaddingTop'));
    const exposeMotifArea = this.model.get('exposeMotifArea');

    this.ui.paddingTop.text(
      exposeMotifArea ? `${motifPrefix}/${paddingTopText}` : paddingTopText
    );
    this.ui.paddingBottom.text(getValueText(paddingBottomScale, this.model.get('paddingBottom')));
    this.ui.portraitPaddingTop.text(
      exposeMotifArea ? `${motifPrefix}/${portraitPaddingTopText}` : portraitPaddingTopText
    );
    this.ui.portraitPaddingBottom.text(getValueText(paddingBottomScale, this.model.get('portraitPaddingBottom')));

    const hasPortrait = this.model.get('customPortraitPaddings');

    this.ui.portraitPaddingTop.toggle(!!hasPortrait);
    this.ui.portraitPaddingBottom.toggle(!!hasPortrait);
  }
});

function getValueText(scale, value) {
  const index = scale.values.indexOf(value);

  if (index >= 0) {
    return scale.texts[index];
  }

  const defaultIndex = scale.values.indexOf(scale.defaultValue);
  return scale.texts[defaultIndex];
}
