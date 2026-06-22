import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';

import {frontend} from 'frontend';
import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';

describe('comment navigation across excursions', () => {
  useCommentingPageObjects();

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    frontend.widgetTypes.register('excursionOverlay', {
      component: ({children}) => <div data-testid="excursion">{children}</div>
    });
  });

  const seed = {
    widgets: [{typeName: 'excursionOverlay', role: 'excursion'}],
    storylines: [
      {id: 1, configuration: {main: true}},
      {id: 2}
    ],
    chapters: [
      {id: 1, storylineId: 1, configuration: {}},
      {id: 2, storylineId: 2, configuration: {title: 'excursion'}}
    ],
    sections: [
      {id: 1, permaId: 100, chapterId: 1},
      {id: 2, permaId: 200, chapterId: 2}
    ],
    contentElements: [
      {id: 1, permaId: 1, sectionId: 1, typeName: 'withTestId', configuration: {testId: 5}},
      {id: 2, permaId: 2, sectionId: 2, typeName: 'withTestId', configuration: {testId: 6}}
    ]
  };

  it('activates the excursion and opens the popover when navigating to its comment', () => {
    const entry = renderEntry({
      seed,
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 2, resolvedAt: null,
           comments: [{id: 10, body: 'Excursion comment', creatorName: 'Bob', creatorId: 2}]}
        ]
      }
    });

    expect(entry.queryByText('Excursion comment')).not.toBeInTheDocument();

    fireEvent.click(entry.getNextCommentButton());

    expect(entry.getByText('Excursion comment')).toBeInTheDocument();
  });

  it('returns from the excursion when navigating onward to a main storyline comment', () => {
    const entry = renderEntry({
      seed,
      commenting: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'ContentElement', subjectId: 1, resolvedAt: null,
           comments: [{id: 10, body: 'Main comment', creatorName: 'Bob', creatorId: 2}]},
          {id: 2, subjectType: 'ContentElement', subjectId: 2, resolvedAt: null,
           comments: [{id: 11, body: 'Excursion comment', creatorName: 'Bob', creatorId: 2}]}
        ]
      }
    });

    const next = entry.getNextCommentButton();

    fireEvent.click(next);
    fireEvent.click(next);
    expect(entry.getByText('Excursion comment')).toBeInTheDocument();

    fireEvent.click(next);

    expect(entry.queryByText('Excursion comment')).not.toBeInTheDocument();
    expect(entry.getByText('Main comment')).toBeInTheDocument();
  });
});
