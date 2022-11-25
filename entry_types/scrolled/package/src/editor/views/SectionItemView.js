import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import {modelLifecycleTrackingView} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';

import {SectionThumbnailView} from './SectionThumbnailView'

import styles from './SectionItemView.module.css';

export const SectionItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.root,

  mixins: [modelLifecycleTrackingView({classNames: styles})],

  template: (data) => `
    <div class="${styles.thumbnailContainer}">
      <div class="${styles.thumbnail}"></div>
      <div class="${styles.clickMask}">
        <div class="${styles.dragHandle}"
             title="${I18n.t('pageflow_scrolled.editor.section_item.drag_hint')}"></div>
      </div>
    </div>
    <span class="${styles.creatingIndicator}" />
    <span class="${styles.destroyingIndicator}" />
    <span class="${styles.failedIndicator}"
          title="${I18n.t('pageflow_scrolled.editor.section_item.save_error')}" />
  `,

  ui: cssModulesUtils.ui(styles, 'thumbnail'),

  events: {
    [`click .${styles.clickMask}`]: function() {
      this.options.entry.trigger('selectSection', this.model);
      this.options.entry.trigger('scrollToSection', this.model);
    },

    [`dblclick .${styles.clickMask}`]: function() {
      this.options.entry.trigger('selectSectionSettings', this.model);
      this.options.entry.trigger('scrollToSection', this.model);
    }
  },

  initialize() {
    this.listenTo(this.options.entry, 'change:currentSectionIndex', () => {
      const active = this.updateActive();

      if (active) {
        this.$el[0].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    });
  },

  onRender() {
    this.updateActive();
    this.$el.toggleClass(styles.invert, !!this.model.configuration.get('invert'));

    this.subview(new SectionThumbnailView({
      el: this.ui.thumbnail,
      model: this.model,
      entry: this.options.entry
    }));
  },

  updateActive() {
    const active =
      this.options.entry.sections.indexOf(this.model) === this.options.entry.get('currentSectionIndex');

    this.$el.toggleClass(styles.active, active);
    return active;
  }
});
