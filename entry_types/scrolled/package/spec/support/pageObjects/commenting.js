import {act, within} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {loadCommentingExtensions} from 'frontend/commenting';
import {clearExtensions} from 'frontend/extensionRegistry';
import contentElementDecoratorStyles from 'frontend/commenting/ContentElementDecorator.module.css';
import badgeStyles from 'review/Badge.module.css';

import {
  renderEntry as baseRenderEntry,
  createContentElementPageObject as baseCreateContentElementPageObject,
  usePageObjects
} from './index';

export function renderEntry({
  commenting = {currentUser: null, commentThreads: []},
  ...options
} = {}) {
  const result = baseRenderEntry({
    ...options,
    entryProps: {commentingInitialState: commenting},
    contentElementFactory: createCommentingContentElementPageObject
  });

  return {
    ...result,
    getCommentToolbar: () => result.getByRole('group', {name: 'Comments'}),
    queryCommentToolbar: () => result.queryByRole('group', {name: 'Comments'}),
    getHideCommentsButton: () => result.getByRole('button', {name: 'Hide comments'}),
    // Matched by prefix since the button also names unread comments.
    getShowCommentsButton: () => result.getByRole('button', {name: /^Show comments/}),
    queryShowCommentsButton: () => result.queryByRole('button', {name: /^Show comments/}),
    getAddCommentButton: () => result.getByRole('button', {name: 'Add comment'}),
    getCancelAddCommentButton: () => result.getByRole('button', {name: 'Cancel add comment'}),
    getNewThreadInput: () => result.getByPlaceholderText('Add a comment...'),
    queryNewThreadInput: () => result.queryByPlaceholderText('Add a comment...'),
    getAllCommentBadges: () => result.getAllByRole('status'),
    queryAllCommentBadges: () => result.queryAllByRole('status'),
    queryAllUnreadCommentBadges: () => result.queryAllByRole('status').filter(
      badge => badge.classList.contains(badgeStyles.unread)
    ),
    getCommentFilterButton: resolution =>
      result.getByRole('button', {name: resolution === 'all' ? 'All' : 'Unresolved'}),
    getPreviousCommentButton: () => result.getByRole('button', {name: 'Previous comment'}),
    getNextCommentButton: () => result.getByRole('button', {name: 'Next comment'}),
    getActivityButton: () => result.getByRole('button', {name: 'Latest activity'}),
    getActivityPanel: () => result.getByRole('dialog', {name: 'Latest activity'}),
    queryActivityPanel: () => result.queryByRole('dialog', {name: 'Latest activity'})
  };
}

export function useCommentingPageObjects() {
  beforeAll(async () => {
    await loadCommentingExtensions();
  });

  afterAll(() => {
    act(() => clearExtensions());
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  useFakeTranslations({
    'pageflow_scrolled.review.add_comment': 'Add comment',
    'pageflow_scrolled.review.cancel_add_comment': 'Cancel add comment',
    'pageflow_scrolled.review.hide_comments': 'Hide comments',
    'pageflow_scrolled.review.show_comments': 'Show comments',
    'pageflow_scrolled.review.comment_toolbar': 'Comments',
    'pageflow_scrolled.review.comment_count': '%{count} comments',
    'pageflow_scrolled.review.select_content_element': 'Select to comment',
    'pageflow_scrolled.review.select_section': 'Select section to comment',
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.refers_to_deleted_element': 'Refers to a deleted element',
    'pageflow_scrolled.review.filter.label': 'Filter comments',
    'pageflow_scrolled.review.filter.unresolved': 'Unresolved',
    'pageflow_scrolled.review.filter.all': 'All',
    'pageflow_scrolled.review.previous_comment': 'Previous comment',
    'pageflow_scrolled.review.next_comment': 'Next comment',
    'pageflow_scrolled.review.activity.toggle': 'Latest activity',
    'pageflow_scrolled.review.activity.no_activity_yet': 'No activity yet',
    'pageflow_scrolled.review.activity.today': 'Today',
    'pageflow_scrolled.review.activity.yesterday': 'Yesterday',
    'pageflow_scrolled.review.reply_count.one': '1 reply',
    'pageflow_scrolled.review.reply_count.other': '%{count} replies',
    'pageflow_scrolled.review.earlier_reply_count.one': '1 more',
    'pageflow_scrolled.review.earlier_reply_count.other': '%{count} more',
    'pageflow_scrolled.review.resolve': 'Mark as resolved',
    'pageflow_scrolled.review.unresolve': 'Mark as unresolved',
    'pageflow_scrolled.review.thread_actions': 'Thread actions',
    'pageflow_scrolled.review.resolution_by': 'Marked as resolved by',
    'pageflow_scrolled.review.resolution': 'Marked as resolved'
  });

  usePageObjects();
}

function createCommentingContentElementPageObject(el) {
  const wrapper = el.closest(`.${contentElementDecoratorStyles.wrapper}`);

  return {
    ...baseCreateContentElementPageObject(el),

    getSelectToCommentButton: () => {
      if (!wrapper) {
        throw new Error(
          'Content element has no commenting wrapper. ' +
          'Was it registered with inlineComments: true?'
        );
      }
      return within(wrapper).getByRole('button', {name: 'Select to comment'});
    },

    hasSelectToCommentButton: () =>
      !!wrapper && !!within(wrapper).queryByRole('button', {name: 'Select to comment'})
  };
}
