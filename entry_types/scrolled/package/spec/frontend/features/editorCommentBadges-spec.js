import '@testing-library/jest-dom/extend-expect';
import {act, waitFor} from '@testing-library/react';
import {features} from 'pageflow/frontend';

import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects';
import {fakeParentWindow} from 'support';

describe('editor comment badges', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    fakeParentWindow();
    window.parent.postMessage = jest.fn();
    features.enable('frontend', ['commenting']);
  });

  it('displays comment badge after receiving review state', async () => {
    const {getByRole} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          permaId: 10,
          configuration: {testId: 5}
        }]
      }
    });

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'REVIEW_STATE_RESET',
          payload: {
            currentUser: {id: 1},
            commentThreads: [{
              id: 1,
              subjectType: 'ContentElement',
              subjectId: 10,
              comments: [{id: 100, body: 'Review this'}]
            }]
          }
        },
        origin: window.location.origin
      }));
    });

    await waitFor(() => {
      expect(getByRole('status')).toBeInTheDocument();
    });
  });
});
