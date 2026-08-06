import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import I18n from 'i18n-js';
import MockDate from 'mockdate';

import {Comment} from 'review/Comment';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('Comment', () => {
  const comment = {
    id: 10,
    body: 'On the pull quote',
    creatorName: 'Bob',
    creatorId: 2,
    createdAt: '2026-03-15T14:30:00Z'
  };

  const originalLocale = I18n.locale;

  // Whether the year is rendered depends on the current date.
  beforeEach(() => {
    MockDate.set('2026-06-01');
  });

  afterEach(() => {
    MockDate.reset();
    I18n.locale = originalLocale;
  });

  // The day rendered depends on the timezone of the machine running
  // the specs. Only assert on the conventions of the formatted date.
  it('formats the timestamp in the interface locale', () => {
    I18n.locale = 'de';

    const {getByText} = renderWithReviewState(<Comment comment={comment} />);

    expect(getByText(/^\d+\. März$/)).toBeInTheDocument();
  });

  it('formats the timestamp according to English conventions', () => {
    I18n.locale = 'en';

    const {getByText} = renderWithReviewState(<Comment comment={comment} />);

    expect(getByText(/^Mar \d+$/)).toBeInTheDocument();
  });

  it('includes the year for comments from previous years', () => {
    I18n.locale = 'en';

    const {getByText} = renderWithReviewState(
      <Comment comment={{...comment, createdAt: '2025-03-15T14:30:00Z'}} />
    );

    expect(getByText(/^Mar \d+, 2025$/)).toBeInTheDocument();
  });

  it('renders machine readable timestamp', () => {
    I18n.locale = 'en';

    const {getByText} = renderWithReviewState(<Comment comment={comment} />);

    expect(getByText(/^Mar \d+$/)).toHaveAttribute('datetime', '2026-03-15T14:30:00Z');
  });
});
