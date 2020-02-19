import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import React from 'react';
import ReactDOM from 'react-dom';
import {editor, modelLifecycleTrackingView} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';

import {watchCollections} from '../../entryState';
import {SectionThumbnail} from 'pageflow-scrolled/frontend'

import styles from './SectionItemView.module.css';

export const SectionItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.root,

  mixins: [modelLifecycleTrackingView({classNames: styles})],

  template: (data) => `
    <div class="${styles.thumbnailContainer}">
      <div class="${styles.thumbnail}"></div>
      <div class="${styles.clickMask}"></div>
    </div>
       <span class="${styles.creatingIndicator}" />
       <span class="${styles.destroyingIndicator}" />
       <span class="${styles.failedIndicator}"
             title="${I18n.t('pageflow_scrolled.editor.section_item.save_error')}" />
    <a href="" class="${styles.editLink}" title="${I18n.t('pageflow_scrolled.editor.section_item.edit')}"></a>
  `,

  ui: cssModulesUtils.ui(styles, 'thumbnail'),

  events: {
    [`click .${styles.clickMask}`]: function() {
      this.options.entry.trigger('scrollToSection', this.model);
    },

    [`click .${styles.editLink}`]: function() {
      if (!this.model.isNew() && !this.model.isDestroying()) {
        this.options.entry.trigger('scrollToSection', this.model);
        editor.navigate(`/scrolled/sections/${this.model.id}`, {trigger: true})
      }
      return false;
    }
  },

  modelEvents: {
    'change:id': 'renderThumbnail'
  },

  initialize() {
    this.listenTo(this.options.entry, 'change:currentSectionIndex', () => {
      const active =
        this.options.entry.sections.indexOf(this.model) === this.options.entry.get('currentSectionIndex');

      this.$el.toggleClass(styles.active, active);

      if (active) {
        this.$el[0].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    });
  },

  onRender() {
    this.timeout = setTimeout(() => {
      this.renderThumbnail();
    }, 100);
  },

  onClose() {
    clearTimeout(this.timeout);
    ReactDOM.unmountComponentAtNode(this.ui.thumbnail[0]);
  },

  renderThumbnail() {
    if (!this.model.isNew()) {
      ReactDOM.render(React.createElement(SectionThumbnail,
                                          {
                                            sectionPermaId: this.model.get('permaId'),
                                            seed: this.options.entry.scrolledSeed,
                                            subscribe: dispatch =>
                                              watchCollections(this.options.entry, {dispatch})
                                          }),
                      this.ui.thumbnail[0]);
    }
  }
});
