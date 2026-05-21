import {act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

  usePageObjects();
}

function createCommentingContentElementPageObject(el) {
  return {
    ...baseCreateContentElementPageObject(el)
  };
}
