import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect';

import {useMotifAreaState} from 'frontend/v1/useMotifAreaState';
jest.mock('frontend/v1/useMotifAreaState');

describe('constrainContentWidth', () => {
  usePageObjects();
  it('applies class for split appearance', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6, configuration: {
          appearance: 'split'
        }}],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).hasConstrainedContentWidth()).toBe(true);
  });

  it('does not apply class for shadow appearance', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6, configuration: {
          appearance: 'shadow'
        }}],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).hasConstrainedContentWidth()).toBe(false);
  });

  it('applies class for split appearance with center layout', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6, configuration: {
          appearance: 'split',
          layout: 'center'
        }}],
        contentElements: [{sectionId: 5, typeName: 'withTestId',
                           configuration: {testId: 1}}]
      }
    });

    expect(getSectionByPermaId(6).hasConstrainedContentWidth()).toBe(true);
  });

  it('does not apply class when content is padded', () => {
    useMotifAreaState.mockContentPadded();

    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6, configuration: {
          appearance: 'split'
        }}],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).hasConstrainedContentWidth()).toBe(false);
  });
});
