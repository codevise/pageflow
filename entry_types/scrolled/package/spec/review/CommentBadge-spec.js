import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import {CommentBadge} from 'review/CommentBadge';
import {renderWithReviewState} from 'testHelpers/renderWithReviewState';

describe('CommentBadge', () => {
  it('does not display count for single thread', () => {
    const {getByRole} = renderWithReviewState(
      <CommentBadge subjectType="ContentElement" subjectId={10} />,
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
      <CommentBadge subjectType="ContentElement" subjectId={10} />,
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

  it('renders nothing when no threads exist for subject', () => {
    const {container} = renderWithReviewState(
      <CommentBadge subjectType="ContentElement" subjectId={10} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  describe('mode icon', () => {
    it('renders icon without count when no threads', () => {
      const {getByRole} = renderWithReviewState(
        <CommentBadge subjectType="ContentElement" subjectId={10} mode="icon" />
      );

      expect(getByRole('status')).toBeInTheDocument();
      expect(getByRole('status')).not.toHaveTextContent(/\d/);
    });

    it('renders full pill when threads exist', () => {
      const {getByRole} = renderWithReviewState(
        <CommentBadge subjectType="ContentElement" subjectId={10} mode="icon" />,
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
        <CommentBadge subjectType="ContentElement" subjectId={10} mode="dot" />
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('renders dot badge without count when threads exist', () => {
      const {getByRole} = renderWithReviewState(
        <CommentBadge subjectType="ContentElement" subjectId={10} mode="dot" />,
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
      const {getByRole} = renderWithReviewState(
        <CommentBadge subjectType="ContentElement" subjectId={10} mode="active" />
      );

      expect(getByRole('status')).toBeInTheDocument();
    });
  });
});
