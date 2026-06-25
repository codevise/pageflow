import {act, within} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {loadCommentingExtensions} from 'frontend/commenting';
import {clearExtensions} from 'frontend/extensionRegistry';
import contentElementDecoratorStyles from 'frontend/commenting/ContentElementDecorator.module.css';

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
    getShowCommentsButton: () => result.getByRole('button', {name: 'Show comments'}),
    queryShowCommentsButton: () => result.queryByRole('button', {name: 'Show comments'}),
    getAddCommentButton: () => result.getByRole('button', {name: 'Add comment'}),
    getCancelAddCommentButton: () => result.getByRole('button', {name: 'Cancel add comment'}),
    getNewThreadInput: () => result.getByPlaceholderText('Add a comment...'),
    queryNewThreadInput: () => result.queryByPlaceholderText('Add a comment...'),
    getAllCommentBadges: () => result.getAllByRole('status'),
    queryAllCommentBadges: () => result.queryAllByRole('status'),
    getCommentFilterButton: resolution =>
      result.getByRole('button', {name: resolution === 'all' ? 'All' : 'Unresolved'}),
    getPreviousCommentButton: () => result.getByRole('button', {name: 'Previous comment'}),
    getNextCommentButton: () => result.getByRole('button', {name: 'Next comment'})
  };
}

export function useCommentingPageObjects() {
  beforeAll(async () => {
    await loadCommentingExtensions();
  });

  afterAll(() => {
    act(() => clearExtensions());
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
    'pageflow_scrolled.review.filter.label': 'Filter comments',
    'pageflow_scrolled.review.filter.unresolved': 'Unresolved',
    'pageflow_scrolled.review.filter.all': 'All',
    'pageflow_scrolled.review.previous_comment': 'Previous comment',
    'pageflow_scrolled.review.next_comment': 'Next comment'
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
