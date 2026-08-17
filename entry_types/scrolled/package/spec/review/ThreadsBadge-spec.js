import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {ThreadsBadge} from 'review/ThreadsBadge';
import {renderWithReviewState} from 'support/renderWithReviewState';
import badgeStyles from 'review/Badge.module.css';

// ThreadsBadge counts the located threads of its subject, so the subject
// must exist in the entry structure.
const seed = {
  sections: [{id: 1, permaId: 1}],
  contentElements: [{id: 1, permaId: 10, sectionId: 1, typeName: 'textBlock'}]
};

function renderThreadsBadge(ui, {commentThreads = [], ...options} = {}) {
  return renderWithReviewState(ui, {seed, commentThreads, ...options});
}

describe('ThreadsBadge', () => {
  describe('unread comments', () => {
    useFakeTranslations({
      'pageflow_scrolled.review.unread_comment_count.one': '1 unread comment',
      'pageflow_scrolled.review.unread_comment_count.other': '%{count} unread comments'
    });

    const currentUser = {id: 42, name: 'Alice'};

    function threadWithComment(attributes) {
      return {
        id: 1,
        permaId: 5,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{
          id: 100,
          creatorId: 43,
          createdAt: '2026-08-17T11:00:00.000Z',
          ...attributes
        }]
      };
    }

    it('marks badge as unread and names the count', () => {
      const {getByRole} = renderThreadsBadge(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} />,
        {currentUser, commentThreads: [threadWithComment()]}
      );

      expect(getByRole('status')).toHaveClass(badgeStyles.unread);
      expect(getByRole('status')).toHaveAttribute('aria-label', '1 unread comment');
    });

    it('counts unread comments across threads of the subject', () => {
      const {getByRole} = renderThreadsBadge(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} />,
        {
          currentUser,
          commentThreads: [
            threadWithComment(),
            {...threadWithComment({id: 101}), id: 2, permaId: 6}
          ]
        }
      );

      expect(getByRole('status')).toHaveAttribute('aria-label', '2 unread comments');
    });

    it('does not mark badge as unread once comments have been read', () => {
      const {getByRole} = renderThreadsBadge(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} />,
        {
          currentUser,
          commentThreads: [threadWithComment()],
          commentThreadReads: {5: '2026-08-17T12:00:00.000Z'}
        }
      );

      expect(getByRole('status')).not.toHaveClass(badgeStyles.unread);
      expect(getByRole('status')).not.toHaveAttribute('aria-label');
    });

    it('does not mark badge as unread for own comments', () => {
      const {getByRole} = renderThreadsBadge(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} />,
        {currentUser, commentThreads: [threadWithComment({creatorId: currentUser.id})]}
      );

      expect(getByRole('status')).not.toHaveClass(badgeStyles.unread);
    });

    it('does not mark badge as unread before current user is known', () => {
      const {getByRole} = renderThreadsBadge(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} />,
        {commentThreads: [threadWithComment()]}
      );

      expect(getByRole('status')).not.toHaveClass(badgeStyles.unread);
    });
  });

  it('does not display count for single thread', () => {
    const {getByRole} = renderThreadsBadge(
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
    const {getByRole} = renderThreadsBadge(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: []},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: []}
        ]
      }
    );

    expect(getByRole('status')).toHaveTextContent('2');
  });

  it('only counts unresolved threads', () => {
    const {getByRole} = renderThreadsBadge(
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

  it('counts a section\'s orphaned threads too', () => {
    const {getByRole} = renderThreadsBadge(
      <ThreadsBadge subjectType="Section" subjectId={1} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'Section', subjectId: 1, comments: []},
          {id: 2, subjectType: 'ContentElement', subjectId: 99999, sectionPermaId: 1, comments: []}
        ]
      }
    );

    expect(getByRole('status')).toHaveTextContent('2');
  });

  it('renders nothing when all threads are resolved', () => {
    const {container} = renderThreadsBadge(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, resolvedAt: '2026-04-09T10:00:00Z', comments: []}
        ]
      }
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the badge as resolved when all shown threads are resolved', () => {
    const {getByRole} = renderThreadsBadge(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} resolution="all" />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, resolvedAt: '2026-04-09T10:00:00Z', comments: []},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, resolvedAt: '2026-04-09T10:00:00Z', comments: []}
        ]
      }
    );

    expect(getByRole('status')).toHaveClass(badgeStyles.resolved);
  });

  it('does not render the badge as resolved when an unresolved thread remains', () => {
    const {getByRole} = renderThreadsBadge(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} resolution="all" />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, resolvedAt: '2026-04-09T10:00:00Z', comments: []},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, resolvedAt: null, comments: []}
        ]
      }
    );

    expect(getByRole('status')).not.toHaveClass(badgeStyles.resolved);
  });

  it('renders nothing when no threads exist for subject', () => {
    const {container} = renderThreadsBadge(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('only counts threads matching subjectRange when provided', () => {
    const subjectRange = {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 12}};

    const {getByRole} = renderThreadsBadge(
      <ThreadsBadge subjectType="ContentElement" subjectId={10} subjectRange={subjectRange} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, subjectRange, comments: []},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: []}
        ]
      }
    );

    expect(getByRole('status')).not.toHaveTextContent(/\d/);
  });

  describe('mode icon', () => {
    it('renders icon without count when no threads', () => {
      const {getByRole} = renderThreadsBadge(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} mode="icon" />
      );

      expect(getByRole('status')).toBeInTheDocument();
      expect(getByRole('status')).not.toHaveTextContent(/\d/);
    });

    it('renders full pill when threads exist', () => {
      const {getByRole} = renderThreadsBadge(
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
      const {container} = renderThreadsBadge(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} mode="dot" />
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('renders dot badge without count when threads exist', () => {
      const {getByRole} = renderThreadsBadge(
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

  describe('mode active', () => {
    it('renders full pill even without threads', () => {
      const {getByRole} = renderThreadsBadge(
        <ThreadsBadge subjectType="ContentElement" subjectId={10} mode="active" />
      );

      expect(getByRole('status')).toBeInTheDocument();
    });
  });
});
