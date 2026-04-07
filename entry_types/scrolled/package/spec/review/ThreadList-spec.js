import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import {ThreadList} from 'review/ThreadList';
import {renderWithReviewState} from 'testHelpers/renderWithReviewState';

describe('ThreadList', () => {
  it('displays comments of threads for subject', () => {
    const {getByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Looks good', creatorName: 'Bob', creatorId: 2}
          ]}
        ]
      }
    );

    expect(getByText('Bob')).toBeInTheDocument();
    expect(getByText('Looks good')).toBeInTheDocument();
  });

  it('only displays threads for given subject', () => {
    const {getByText, queryByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'Matching', creatorName: 'Bob', creatorId: 2}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 20, comments: [
            {id: 20, body: 'Other element', creatorName: 'Alice', creatorId: 1}
          ]},
          {id: 3, subjectType: 'Section', subjectId: 10, comments: [
            {id: 30, body: 'Other type', creatorName: 'Eve', creatorId: 3}
          ]}
        ]
      }
    );

    expect(getByText('Matching')).toBeInTheDocument();
    expect(queryByText('Other element')).not.toBeInTheDocument();
    expect(queryByText('Other type')).not.toBeInTheDocument();
  });

  it('displays multiple threads', () => {
    const {getByText} = renderWithReviewState(
      <ThreadList subjectType="ContentElement" subjectId={10} />,
      {
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 10, body: 'First thread', creatorName: 'Bob', creatorId: 2}
          ]},
          {id: 2, subjectType: 'ContentElement', subjectId: 10, comments: [
            {id: 20, body: 'Second thread', creatorName: 'Alice', creatorId: 1}
          ]}
        ]
      }
    );

    expect(getByText('First thread')).toBeInTheDocument();
    expect(getByText('Second thread')).toBeInTheDocument();
  });
});
