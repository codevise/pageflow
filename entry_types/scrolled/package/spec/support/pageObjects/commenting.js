import {act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {loadCommentingComponents} from 'frontend/commenting';
import {clearExtensions} from 'frontend/extensionRegistry';

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
    async toggleAddCommentMode() {
      const user = userEvent.setup();
      await user.click(result.getByRole('button', {name: 'Add comment'}));
    }
  };
}

export function useCommentingPageObjects() {
  beforeAll(async () => {
    await loadCommentingComponents();
  });

  afterAll(() => {
    act(() => clearExtensions());
  });

  useFakeTranslations({
    'pageflow_scrolled.review.add_comment': 'Add comment',
    'pageflow_scrolled.review.cancel_add_comment': 'Cancel add comment',
    'pageflow_scrolled.review.select_content_element': 'Select to comment',
    'pageflow_scrolled.review.select_text_to_comment': 'Select text to comment',
    'pageflow_scrolled.review.add_comment_placeholder': 'Add a comment...',
    'pageflow_scrolled.review.new_topic': 'New topic',
    'pageflow_scrolled.review.send': 'Send',
    'pageflow_scrolled.review.cancel': 'Cancel'
  });

  usePageObjects();
}

function createCommentingContentElementPageObject(el) {
  return {
    ...baseCreateContentElementPageObject(el)
  };
}
