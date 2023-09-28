import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import {modelLifecycleTrackingView, DropDownButtonView} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';

import {SectionThumbnailView} from './SectionThumbnailView'
import {getAvailableTransitionNames} from 'pageflow-scrolled/frontend';

import arrowsIcon from './images/arrows.svg';

import styles from './SectionItemView.module.css';

export const SectionItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: `${styles.root} ${styles.withTransition}`,

  mixins: [modelLifecycleTrackingView({classNames: styles})],

  template: (data) => `
    <button class="${styles.editTransition}">
      <img src="${arrowsIcon}" width="11" height="16">
      <span class="${styles.transition}">Überblenden</span>
    </button>
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
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'thumbnail', 'dropDownButton', 'editTransition', 'transition'),

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
    this.listenTo(this.options.entry, 'change:currentSectionIndex', () => {
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
  },

  onRender() {
    this.updateTransition();

    if (this.updateActive()) {
      setTimeout(() => this.$el[0].scrollIntoView({block: 'nearest'}), 10)
    }

    this.$el.toggleClass(styles.invert, !!this.model.configuration.get('invert'));

    this.subview(new SectionThumbnailView({
      el: this.ui.thumbnail,
      model: this.model,
      entry: this.options.entry
    }));

    const dropDownMenuItems = new Backbone.Collection();

    dropDownMenuItems.add(new MenuItem({
      label: I18n.t('pageflow_scrolled.editor.section_item.duplicate')
    }, {
      selected: () =>
        this.model.chapter.duplicateSection(this.model)
    }));

    dropDownMenuItems.add(new MenuItem({
      label: I18n.t('pageflow_scrolled.editor.section_item.insert_section_above')
    }, {
      selected: () =>
        this.model.chapter.insertSection({before: this.model})
    }));

    dropDownMenuItems.add(new MenuItem({
      label: I18n.t('pageflow_scrolled.editor.section_item.insert_section_below')
    }, {
      selected: () =>
        this.model.chapter.insertSection({after: this.model})
    }));

    this.appendSubview(new DropDownButtonView({
      items: dropDownMenuItems,
      alignMenu: 'right',
      ellipsisIcon: true,
      openOnClick: true
    }), {to: this.ui.dropDownButton});
  },

  updateTransition() {
    this.ui.transition.text(
      I18n.t(this.model.getTransition(),
             {scope: 'pageflow_scrolled.editor.section_item.transitions'})
    );
  },

  updateActive() {
    const active =
      this.options.entry.sections.indexOf(this.model) === this.options.entry.get('currentSectionIndex');

    this.$el.toggleClass(styles.active, active);
    return active;
  }
});

const MenuItem = Backbone.Model.extend({
  initialize: function(attributes, options) {
    this.options = options;
  },

  selected: function() {
    this.options.selected();
  }
});
