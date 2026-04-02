import React from 'react';
import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect';

import {api} from 'frontend/api';

import {useMotifAreaState} from 'frontend/useMotifAreaState';
jest.mock('frontend/useMotifAreaState');

describe('constrainContentWidth', () => {
  usePageObjects();

  beforeEach(() => {
    api.contentElementTypes.register('probe', {
      component: function Probe({sectionProps}) {
        return (
          <div data-testid="probe"
               data-constrain-content-width={sectionProps.constrainContentWidth ? 'true' : 'false'} />
        );
      }
    });
  });

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

  it('passes constrainContentWidth to content elements via sectionProps', () => {
    const {getByTestId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6, configuration: {
          appearance: 'split'
        }}],
        contentElements: [{sectionId: 5, typeName: 'probe'}]
      }
    });

    expect(getByTestId('probe')).toHaveAttribute('data-constrain-content-width', 'true');
  });

  it('does not pass constrainContentWidth for shadow appearance', () => {
    const {getByTestId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6, configuration: {
          appearance: 'shadow'
        }}],
        contentElements: [{sectionId: 5, typeName: 'probe'}]
      }
    });

    expect(getByTestId('probe')).toHaveAttribute('data-constrain-content-width', 'false');
  });
});
