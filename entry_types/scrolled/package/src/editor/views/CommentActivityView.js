import React from 'react';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {editor} from 'pageflow/editor';
import {TabsView} from 'pageflow/ui';
import {ActivityList} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';

import styles from './CommentActivityView.module.css';

export const CommentActivityView = Marionette.ItemView.extend({
  className: `comment_activity_view ${styles.root}`,

  template: () => `
    <a class="back">${I18n.t('pageflow_scrolled.editor.comment_activity_view.back')}</a>
    <div class="tabs"></div>
  `,

  ui: {
    tabs: '.tabs'
  },

  events: {
    'click a.back': 'goBack'
  },

  onRender: function() {
    const {entry} = this.options;

    const tabsView = new TabsView({
      i18n: 'pageflow_scrolled.editor.comment_activity_view.tabs'
    });

    tabsView.tab('activity', () => new ActivityListView({entry}));

    this.appendSubview(tabsView, {to: this.ui.tabs});
  },

  goBack: function() {
    editor.navigate('/scrolled/comments', {trigger: true});
  }
});

const ActivityListView = ReviewView.extend({
  className: styles.list,

  initialize() {
    this._trackHighlight();

    // Structure changes reach React through WatchEntryCollections and
    // review state through the ReviewMessageHandler, so only the
    // highlight needs a rerender here.
    this.listenTo(this.options.entry, 'change:highlightedThreadId', () => {
      this._trackHighlight();
      this.rerender();
    });
  },

  props() {
    return {
      highlightedThreadId: this.selectedThreadId,
      onEntryClick: entry => this._selectThread(entry.threadId)
    };
  },

  renderContent(props) {
    return <ActivityList {...props} />;
  },

  _selectThread(threadId) {
    this.selectedThreadId = threadId;
    this.options.entry.trigger('selectCommentThread', threadId);
    this.rerender();
  },

  // The preview reports selected section threads without a highlighted id,
  // so the id of the clicked row is kept here to survive the round trip.
  _trackHighlight() {
    const highlightedThreadId = this.options.entry.get('highlightedThreadId');

    if (highlightedThreadId) {
      this.selectedThreadId = highlightedThreadId;
    }
  }
});
