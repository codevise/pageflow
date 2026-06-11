import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import {ThreadsBadge} from 'review/ThreadsBadge';
import {renderWithReviewState} from 'support/renderWithReviewState';
import {fakeParentWindow} from 'support';

describe('ThreadsBadge', () => {
  it('does not display count for single thread', () => {
    const {getByRole} = renderWithReviewState(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: []}
        ]
      }
    );

    expect(getByRole('status')).not.toHaveTextContent(/\d/);
  });

  it('displays thread count for subject', () => {
    const {getByRole} = renderWithReviewState(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: []},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: []},
          {id: 3, subjectType: 'ContentElement', subjectId: 20, comments: []}
        ]
      }
    );

    expect(getByRole('status')).toHaveTextContent('2');
  });

  it('only counts unresolved threads', () => {
    const {getByRole} = renderWithReviewState(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, resolvedAt: null, comments: []},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, resolvedAt: null, comments: []},
          {id: 3, subjectType: 'ContentElement', subjectId: 10, resolvedAt: '2026-04-09T10:00:00Z', comments: []}
        ]
      }
    );

    expect(getByRole('status')).toHaveTextContent('2');
  });

  it('renders nothing when all threads are resolved', () => {
    const {container} = renderWithReviewState(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, resolvedAt: '2026-04-09T10:00:00Z', comments: []}
        ]
      }
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when no threads exist for subject', () => {
    const {container} = renderWithReviewState(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  describe('mode icon', () => {
    it('renders icon without count when no threads', () => {
      const {getByRole} = renderWithReviewState(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} mode="icon" />
      );

      expect(getByRole('status')).toBeInTheDocument();
      expect(getByRole('status')).not.toHaveTextContent(/\d/);
    });

    it('renders full pill when threads exist', () => {
      const {getByRole} = renderWithReviewState(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} mode="icon" />,
        {
          commentThreads: [
            {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: []},
            {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: []}
          ]
        }
      );

      expect(getByRole('status')).toHaveTextContent('2');
    });
  });

  describe('mode dot', () => {
    it('renders nothing when no threads', () => {
      const {container} = renderWithReviewState(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} mode="dot" />
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('renders dot badge without count when threads exist', () => {
      const {getByRole} = renderWithReviewState(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} mode="dot" />,
        {
          commentThreads: [
            {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: []}
          ]
        }
      );

      expect(getByRole('status')).toBeInTheDocument();
      expect(getByRole('status')).not.toHaveTextContent(/\d/);
    });
  });

  it('only counts threads matching subjectRange when provided', () => {
    const subjectRange = {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 12}};

    const {getByRole} = renderWithReviewState(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} subjectRange={subjectRange} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, subjectRange, comments: []},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: []},
          {id: 3, subjectType: 'ContentElement', subjectId: 10,
           subjectRange: {anchor: {path: [1, 0], offset: 0}, focus: {path: [1, 0], offset: 5}},
           comments: []}
        ]
      }
    );

    expect(getByRole('status')).not.toHaveTextContent(/\d/);
  });

  describe('mode active', () => {
    it('renders full pill even without threads', () => {
      const {getByRole} = renderWithReviewState(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} mode="active" />
      );

      expect(getByRole('status')).toBeInTheDocument();
    });
  });

  describe('on SELECT_COMMENT_THREAD message', () => {
    let scrollIntoView;

    beforeEach(() => {
      fakeParentWindow();
      scrollIntoView = jest.fn();
      Element.prototype.scrollIntoView = scrollIntoView;
    });

    afterEach(() => {
      delete Element.prototype.scrollIntoView;
    });

    it('scrolls into view and calls onSelectThread when threadId matches', async () => {
      const onSelectThread = jest.fn();

      renderWithReviewState(
        <ThreadsBadge subjectType="ContentElement"
                      subjectId={10}
                      onSelectThread={onSelectThread} />,
        {
          commentThreads: [
            {id: 5, subjectType: 'ContentElement', subjectId: 10, comments: []}
          ]
        }
      );

      await new Promise(resolve => {
        window.postMessage({
          type: 'SELECT_COMMENT_THREAD',
          payload: {threadId: 5}
        }, '*');
        setTimeout(resolve, 0);
      });

      expect(scrollIntoView).toHaveBeenCalled();
      expect(onSelectThread).toHaveBeenCalledWith(5);
    });

    it('ignores messages for non-matching threadIds', async () => {
      const onSelectThread = jest.fn();

      renderWithReviewState(
        <ThreadsBadge subjectType="ContentElement"
                      subjectId={10}
                      onSelectThread={onSelectThread} />,
        {
          commentThreads: [
            {id: 5, subjectType: 'ContentElement', subjectId: 10, comments: []}
          ]
        }
      );

      await new Promise(resolve => {
        window.postMessage({
          type: 'SELECT_COMMENT_THREAD',
          payload: {threadId: 999}
        }, '*');
        setTimeout(resolve, 0);
      });

      expect(scrollIntoView).not.toHaveBeenCalled();
      expect(onSelectThread).not.toHaveBeenCalled();
    });
  });
});
