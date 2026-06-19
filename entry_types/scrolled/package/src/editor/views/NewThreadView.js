import React from 'react';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {editor} from 'pageflow/editor';
import {TabsView} from 'pageflow/ui';
import {NewThreadForm} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';

import styles from './NewThreadView.module.css';

export const NewThreadView = Marionette.ItemView.extend({
  className: `new_thread_view ${styles.root}`,

  template: () => `
    <a class="back">${I18n.t('pageflow_scrolled.editor.new_thread_view.back')}</a>
    <div class="tabs"></div>
  `,

  ui: {
    tabs: '.tabs'
  },

  events: {
    'click a.back': 'goBack'
  },

  onRender: function() {
    const {entry, subjectType, subjectId, subjectRange} = this.options;

    const tabsView = new TabsView({
      i18n: 'pageflow_scrolled.editor.new_thread_view.tabs'
    });

    tabsView.tab('newComment', () => new NewThreadFormView({
      entry, subjectType, subjectId, subjectRange
    }));

    this.appendSubview(tabsView, {to: this.ui.tabs});
  },

  goBack: function() {
    editor.navigate('/scrolled/comments?tab=selection', {trigger: true});
  }
});

const NewThreadFormView = ReviewView.extend({
  renderContent() {
    const {entry, subjectType, subjectId, subjectRange} = this.options;
    const leave = () => entry.trigger('resetSelection');

    return (
      <NewThreadForm subjectType={subjectType}
                     subjectId={subjectId}
                     subjectRange={subjectRange}
                     onSubmit={leave} />
    );
  }
});
