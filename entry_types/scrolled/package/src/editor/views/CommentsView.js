import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {editor} from 'pageflow/editor';
import {TabsView} from 'pageflow/ui';

import {EntryCommentsView} from './EntryCommentsView';
import {ContentElementCommentsView} from './ContentElementCommentsView';

export const CommentsView = Marionette.ItemView.extend({
  className: 'comments_view',

  template: () => `
    <a class="back">${I18n.t('pageflow.editor.templates.back_button_decorator.outline')}</a>
    <div class="tabs"></div>
  `,

  ui: {
    tabs: '.tabs'
  },

  events: {
    'click a.back': 'goBack'
  },

  onRender: function() {
    const {entry, defaultTab} = this.options;

    const tabsView = new TabsView({
      i18n: 'pageflow_scrolled.editor.comments_view.tabs',
      defaultTab: defaultTab || 'comments'
    });

    tabsView.tab('comments', () =>
      new EntryCommentsView({entry, editor: this.options.editor}));
    tabsView.tab('selection', () =>
      new ContentElementCommentsView({entry, editor: this.options.editor}));

    this.appendSubview(tabsView, {to: this.ui.tabs});
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});
