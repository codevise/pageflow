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
    getAddCommentButton: () => result.getByRole('button', {name: 'Add comment'}),
    getCancelAddCommentButton: () => result.getByRole('button', {name: 'Cancel add comment'}),
    getNewThreadInput: () => result.getByPlaceholderText('Add a comment...'),
    queryNewThreadInput: () => result.queryByPlaceholderText('Add a comment...'),
    getAllCommentBadges: () => result.getAllByRole('status'),
    queryAllCommentBadges: () => result.queryAllByRole('status')
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
    'pageflow_scrolled.review.select_content_element': 'Select to comment',
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...'
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
