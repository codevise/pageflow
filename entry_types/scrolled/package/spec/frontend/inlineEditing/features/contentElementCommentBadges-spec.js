import '@testing-library/jest-dom/extend-expect';
import {act, waitFor} from '@testing-library/react';
import {useFakeFeatures} from 'pageflow/testHelpers';

import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects/inlineEditing';

import badgeStyles from 'review/Badge.module.css';

describe('inline editing content element comment badges', () => {
  useInlineEditingPageObjects();
  useFakeFeatures('frontend', ['commenting']);

  it('does not display comment icon when element is not selected', () => {
    const {queryByRole} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'withTestId',
          permaId: 10,
          configuration: {testId: 5}
        }]
      }
    });

    expect(queryByRole('status')).not.toBeInTheDocument();
  });

  it('displays dot badge when threads exist and element is not selected', async () => {
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
      expect(getByRole('status')).not.toHaveTextContent(/\d/);
    });
  });

  it('renders badge in active mode when newThread is selected on the element', () => {
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
          type: 'SELECT',
          payload: {type: 'newThread', subjectType: 'ContentElement', subjectId: 10}
        },
        origin: window.location.origin
      }));
    });

    expect(getByRole('status')).toHaveClass(badgeStyles.active);
  });

  it('selects the thread and scrolls into view on SELECT_COMMENT_THREAD', async () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const {getByRole} = renderEntry({
      seed: {
        contentElements: [{
          id: 1,
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
              id: 7,
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

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {type: 'SELECT_COMMENT_THREAD', payload: {threadId: 7}},
        origin: window.location.origin
      }));
    });

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {type: 'contentElementComments', id: 1, highlightedThreadId: 7}
    }, expect.anything());
    expect(scrollIntoView).toHaveBeenCalled();

    delete Element.prototype.scrollIntoView;
  });

  it('reveals a resolved thread on SELECT_COMMENT_THREAD even without a badge', () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const {queryByRole} = renderEntry({
      seed: {
        contentElements: [{
          id: 1,
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
              id: 7,
              subjectType: 'ContentElement',
              subjectId: 10,
              resolvedAt: '2026-06-01T00:00:00Z',
              comments: [{id: 100, body: 'Resolved'}]
            }]
          }
        },
        origin: window.location.origin
      }));
    });

    // Resolved threads are not counted by the badge.
    expect(queryByRole('status')).not.toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {type: 'SELECT_COMMENT_THREAD', payload: {threadId: 7}},
        origin: window.location.origin
      }));
    });

    expect(window.parent.postMessage).toHaveBeenCalledWith({
      type: 'SELECTED',
      payload: {type: 'contentElementComments', id: 1, highlightedThreadId: 7}
    }, expect.anything());
    expect(scrollIntoView).toHaveBeenCalled();

    delete Element.prototype.scrollIntoView;
  });

  it('ignores SELECT_COMMENT_THREAD for a thread of another subject', () => {
    renderEntry({
      seed: {
        contentElements: [{
          id: 1,
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
              id: 7,
              subjectType: 'ContentElement',
              subjectId: 10,
              comments: [{id: 100, body: 'Review this'}]
            }]
          }
        },
        origin: window.location.origin
      }));
    });

    window.parent.postMessage.mockClear();

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {type: 'SELECT_COMMENT_THREAD', payload: {threadId: 999}},
        origin: window.location.origin
      }));
    });

    expect(window.parent.postMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({type: 'SELECTED'}),
      expect.anything()
    );
  });
});
