import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import {modelLifecycleTrackingView, DropDownButtonView} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';

import {SectionThumbnailView} from './SectionThumbnailView'

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

    dropDownMenuItems.add(new HideShowMenuItem({}, {
      section: this.model
    }));

    if (this.options.entry.cutoff.isEnabled()) {
      dropDownMenuItems.add(new CutoffMenuItem({}, {
        cutoff: this.options.entry.cutoff,
        section: this.model
      }));
    }

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

  updateCutoffIndicator() {
    this.ui.cutoffIndicator.css(
      'display',
      this.options.entry.cutoff.isEnabled() &&
      this.options.entry.cutoff.isAtSection(this.model)
      ?  '' : 'none'
    );
  },

  updateActive() {
    const active =
      this.options.entry.sections.indexOf(this.model) === this.options.entry.get('currentSectionIndex');

    this.$el.toggleClass(styles.active, active);
    return active;
  },

  updateHidden() {
    this.$el.toggleClass(styles.hidden, !!this.model.configuration.get('hidden'));
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

const CutoffMenuItem = Backbone.Model.extend({
  initialize: function(attributes, {cutoff, section}) {
    this.cutoff = cutoff;
    this.section = section;

    this.listenTo(cutoff, 'change', this.update);
    this.update();
  },

  selected() {
    if (this.cutoff.isAtSection(this.section)) {
      this.cutoff.reset();
    }
    else {
      this.cutoff.setSection(this.section);
    }
  },

  update() {
    this.set('label', I18n.t(
      this.cutoff.isAtSection(this.section) ?
      'pageflow_scrolled.editor.section_item.reset_cutoff' :
      'pageflow_scrolled.editor.section_item.set_cutoff'
    ));
  }
});

const HideShowMenuItem = Backbone.Model.extend({
  initialize: function(attributes, {section}) {
    this.section = section;

    this.listenTo(section.configuration, 'change:hidden', this.update);
    this.update();
  },

  selected() {
    if (this.section.configuration.get('hidden')) {
      this.section.configuration.unset('hidden')
    }
    else {
      this.section.configuration.set('hidden', true)
    }
  },

  update() {
    this.set('label', I18n.t(
      this.section.configuration.get('hidden') ?
      'pageflow_scrolled.editor.section_item.show' :
      'pageflow_scrolled.editor.section_item.hide'
    ));
  }
});
