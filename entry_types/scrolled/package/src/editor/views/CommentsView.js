import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {editor} from 'pageflow/editor';
import {cssModulesUtils, TabsView} from 'pageflow/ui';

import {EntryCommentsView} from './EntryCommentsView';
import {SelectionCommentsView} from './SelectionCommentsView';

import styles from './CommentsView.module.css';

export const CommentsView = Marionette.ItemView.extend({
  className: styles.root,

  template: () => `
    <a class="back">${I18n.t('pageflow.editor.templates.back_button_decorator.outline')}</a>
    <button class="${styles.newThreadButton}">${I18n.t('pageflow_scrolled.editor.comments_view.new_thread')}</button>
    <div class="tabs"></div>
  `,

  ui: {
    tabs: '.tabs'
  },

  events: {
    'click a.back': 'goBack',
    ...cssModulesUtils.events(styles, {
      'click newThreadButton': 'startNewThread'
    })
  },

  initialize: function() {
    this.listenTo(this.options.entry,
                  'change:selectedCommentsSubject',
                  this._updateNewThreadButton);
  },

  onRender: function() {
    const {entry, defaultTab, editor: editorApi} = this.options;

    const tabsView = new TabsView({
      i18n: 'pageflow_scrolled.editor.comments_view.tabs',
      defaultTab: defaultTab || 'comments'
    });

    tabsView.tab('comments', () =>
      new EntryCommentsView({entry, editor: editorApi}));
    tabsView.tab('selection', () =>
      new SelectionCommentsView({entry, editor: editorApi}));

    this.appendSubview(tabsView, {to: this.ui.tabs});
    this._updateNewThreadButton();
  },

  startNewThread: function() {
    const {entry} = this.options;
    const subject = entry.get('selectedCommentsSubject');
    if (!subject) return;

    if (subject.subjectType === 'Section') {
      const section = entry.sections.get(subject.id);
      entry.trigger('selectNewThread', {
        subjectId: section.get('permaId'),
        subjectType: 'Section'
      });
    }
    else {
      const contentElement = entry.contentElements.get(subject.id);
      entry.trigger('selectNewThread', {
        subjectId: contentElement.get('permaId'),
        subjectType: 'ContentElement',
        range: contentElement.transientState.get('newCommentThreadSubjectRange')
      });
    }
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  },

  _updateNewThreadButton: function() {
    const enabled = !!this.options.entry.get('selectedCommentsSubject');
    this.$(cssModulesUtils.selector(styles, 'newThreadButton'))
      .prop('disabled', !enabled);
  }
});
