import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import {modelLifecycleTrackingView, DropDownButtonView} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';

import {SectionThumbnailView} from './SectionThumbnailView'
import {createSectionMenuItems} from '../models/SectionMenuItems';

import arrowsIcon from './images/arrows.svg';
import hiddenIcon from './images/hidden.svg';

import styles from './SectionItemView.module.css';

export const SectionItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: `${styles.root} ${styles.withTransition}`,

  mixins: [modelLifecycleTrackingView({classNames: styles})],

  template: (data) => `
    <div class="${styles.cutoffIndicator}">
      ${I18n.t('pageflow_scrolled.editor.section_item.cutoff')}
    </div>
    <button class="${styles.editTransition}">
      <img src="${arrowsIcon}" width="11" height="16">
      <span class="${styles.transition}">Überblenden</span>
    </button>
    <div class="${styles.outline}">
      <div class="${styles.inner}">
        <div class="${styles.thumbnailContainer}">
          <div class="${styles.dropDownButton}"></div>
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
        <img class="${styles.hiddenIndicator}"
             title="${I18n.t('pageflow_scrolled.editor.section_item.hidden')}"
             src="${hiddenIcon}"
             width="30"
             height="30">
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles,
                         'thumbnail', 'dropDownButton', 'editTransition',
                         'transition', 'cutoffIndicator'),

  events: cssModulesUtils.events(styles, {
    'click clickMask': function() {
      this.options.entry.trigger('selectSection', this.model);
      this.options.entry.trigger('scrollToSection', this.model);
    },

    'dblclick clickMask': function() {
      this.options.entry.trigger('selectSectionSettings', this.model);
      this.options.entry.trigger('scrollToSection', this.model);
    },

    'click editTransition': function() {
      this.options.entry.trigger('selectSectionTransition', this.model);
      this.options.entry.trigger('scrollToSection', this.model);
    }
  }),

  initialize() {
    this.listenTo(this.options.entry, 'change:currentSectionIndex change:currentExcursionId', () => {
      const active = this.updateActive();

      if (active) {
        this.$el[0].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    });

    this.listenTo(this.options.entry.sections, 'add', () => {
      this.updateActive();
      this.updateTransition();
    });

    this.listenTo(this.options.entry.cutoff, 'change', () => {
      this.updateCutoffIndicator();
    });

    this.listenTo(this.model.configuration, 'change:hidden', () => {
      this.updateHidden();
    });
  },

  onRender() {
    this.updateTransition();
    this.updateCutoffIndicator();
    this.updateHidden();

    if (this.updateActive()) {
      setTimeout(() => this.$el[0].scrollIntoView({block: 'nearest'}), 10)
    }

    this.$el.toggleClass(styles.invert, !!this.model.configuration.get('invert'));

    this.subview(new SectionThumbnailView({
      el: this.ui.thumbnail,
      model: this.model,
      entry: this.options.entry
    }));

    const dropDownMenuItems = new Backbone.Collection(
      createSectionMenuItems({entry: this.options.entry, section: this.model})
    );

    this.appendSubview(new DropDownButtonView({
      items: dropDownMenuItems,
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true
    }), {to: this.ui.dropDownButton});
  },

  updateTransition() {
    this.ui.transition.text(
      I18n.t(this.model.getTransition(),
             {scope: 'pageflow_scrolled.editor.section_item.transitions'})
    );
  },

  updateCutoffIndicator() {
    this.ui.cutoffIndicator.css(
      'display',
      this.options.entry.cutoff.isEnabled() &&
      this.options.entry.cutoff.isAtSection(this.model)
      ?  '' : 'none'
    );
  },

  updateActive() {
    const active = this.model.isCurrent();

    this.$el.toggleClass(styles.active, active);
    this.$el.attr('aria-current', active ? 'true' : null);

    return active;
  },

  updateHidden() {
    this.$el.toggleClass(styles.hidden, !!this.model.configuration.get('hidden'));
  }
});
