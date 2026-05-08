import React from 'react';
import Marionette from 'backbone.marionette';

import {TabsView} from 'pageflow/ui';
import {NewThreadForm} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';

import styles from './NewThreadView.module.css';

export const NewThreadView = Marionette.View.extend({
  className: `new_thread_view ${styles.root}`,

  initialize: function() {
    const {entry, subjectType, subjectId, subjectRange} = this.options;

    this.tabsView = new TabsView({
      i18n: 'pageflow_scrolled.editor.new_thread_view.tabs'
    });

    this.tabsView.tab('newComment', () => new NewThreadFormView({
      entry, subjectType, subjectId, subjectRange
    }));
  },

  render: function() {
    this.$el.empty();
    this.appendSubview(this.tabsView);
    return this;
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
                     onSubmit={leave}
                     onCancel={leave} />
    );
  }
});
