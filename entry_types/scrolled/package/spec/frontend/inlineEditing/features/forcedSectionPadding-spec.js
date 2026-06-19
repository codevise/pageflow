import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';
import {useSectionMatchers} from 'support/matchers';

import {features} from 'pageflow/frontend';
import {act, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('inline editing forced section padding', () => {
  useInlineEditingPageObjects();
  useSectionMatchers();

  function resetReviewStateWith(commentThreads) {
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: {
          type: 'REVIEW_STATE_RESET',
          payload: {currentUser: {id: 1}, commentThreads}
        },
        origin: window.location.origin
      }));
    });
  }

  it('forces padding below full width element if section is selected', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5, configuration: {width: 3}}]
      }
    });

    const section = getSectionByPermaId(6);
    section.select();

    expect(section).toHaveForcedPadding();
  });

  it('forces padding below full width element if element is selected', () => {
    const {getSectionByPermaId, getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{
          sectionId: 5,
          typeName: 'withTestId',
          configuration: {testId: 10, width: 3}
        }]
      }
    });

    getContentElementByTestId(10).select();

    expect(getSectionByPermaId(6)).toHaveForcedPadding();
  });

  it('forces padding when section comments are selected', () => {
    features.enable('frontend', ['commenting']);

    const {getByRole, getSectionByPermaId} = renderEntry({
      seed: {sections: [{id: 5, permaId: 6}]}
    });

    resetReviewStateWith([{
      id: 1, subjectType: 'Section', subjectId: 6,
      comments: [{id: 100, body: 'Review this'}]
    }]);

    fireEvent.click(getByRole('status'));

    expect(getSectionByPermaId(6)).toHaveForcedPadding();
  });

  it('forces padding when a new thread on the section is selected', () => {
    features.enable('frontend', ['commenting']);

    const {getByRole, getSectionByPermaId} = renderEntry({
      seed: {sections: [{id: 5, permaId: 6}]}
    });

    // Reveal the section's icon badge, then start a new thread from it.
    getSectionByPermaId(6).select();
    fireEvent.click(getByRole('status'));

    expect(getSectionByPermaId(6)).toHaveForcedPadding();
  });

  it('does not force padding if padding is selected', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5, configuration: {width: 3}}]
      }
    });

    const section = getSectionByPermaId(6);
    section.selectPadding('bottom');

    expect(section).not.toHaveForcedPadding();
  });
});
