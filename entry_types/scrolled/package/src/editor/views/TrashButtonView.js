import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import {cssModulesUtils} from 'pageflow/ui';
import {editor} from 'pageflow-scrolled/editor';

import styles from './TrashButtonView.module.css';

export const TrashButtonView = Marionette.ItemView.extend({
  tagName: 'button',
  className: styles.button,

  attributes: () => ({
    title: I18n.t('pageflow_scrolled.editor.entry_outline.trash'),
    'aria-label': I18n.t('pageflow_scrolled.editor.entry_outline.trash')
  }),

  template: () => `
    <svg class="${styles.icon}"
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
         fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M5 6v6" />
      <path d="M16 22h1a2 2 0 0 0 2-2V6" />
      <path d="M10 11v4" />
      <path d="M14 11v4" />
      <path d="m5 16-3 3 3 3" />
      <path d="M12 22v-1a2 2 0 0 0-2-2H2" />
    </svg>
  `,

  events: {
    click() {
      editor.navigate('/scrolled/trash', {trigger: true});
    },

    ...cssModulesUtils.events(styles, {
      'animationend icon': function() {
        this.$el.removeClass(styles.nudging);
        this.circle?.removeClass(styles.nudging);
      }
    })
  },

  initialize() {
    this.listenTo(this.options.entry, 'change:hasUnseenTrashItems', this.nudge);
  },

  onRender() {
    this.nudge();
  },

  onClose() {
    this.circle?.remove();
  },

  nudge() {
    const {entry, nudgeContainer} = this.options;

    if (!entry.get('hasUnseenTrashItems')) {
      return;
    }

    entry.set('hasUnseenTrashItems', false);

    window.requestAnimationFrame(() => {
      if (this.isClosed) {
        return;
      }

      const containerRect = nudgeContainer.getBoundingClientRect();
      const buttonRect = this.el.getBoundingClientRect();

      this.circle = this.circle || $(`<div class="${styles.circle}"></div>`)
        .appendTo(nudgeContainer);

      this.circle.css({
        left: buttonRect.left - containerRect.left + buttonRect.width / 2,
        top: buttonRect.top - containerRect.top + buttonRect.height / 2
      });

      this.circle.addClass(styles.nudging);
      this.$el.addClass(styles.nudging);
    });
  }
});
