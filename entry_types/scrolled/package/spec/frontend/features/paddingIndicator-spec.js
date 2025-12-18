import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects';
import {fakeParentWindow} from 'support';
import {useMotifAreaState} from 'frontend/v1/useMotifAreaState';
import '@testing-library/jest-dom/extend-expect';

jest.mock('frontend/v1/useMotifAreaState');

describe('PaddingIndicator', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    fakeParentWindow();
  });

  it('displays scale translation for top padding when section is selected', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          permaId: 10,
          configuration: {
            paddingTop: 'lg'
          }
        }],
        contentElements: [{sectionId: 1}],
        themeTranslations: {
          scales: {
            sectionPaddingTop: {
              lg: 'Large'
            }
          }
        }
      }
    });

    const section = getSectionByPermaId(10);
    section.select();

    expect(section.getPaddingIndicator('top')).toHaveTextContent('Large');
  });

  it('displays scale translation for bottom padding when section is selected', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          permaId: 10,
          configuration: {
            paddingBottom: 'md'
          }
        }],
        contentElements: [{sectionId: 1}],
        themeTranslations: {
          scales: {
            sectionPaddingBottom: {
              md: 'Medium'
            }
          }
        }
      }
    });

    const section = getSectionByPermaId(10);
    section.select();

    expect(section.getPaddingIndicator('bottom')).toHaveTextContent('Medium');
  });

  it('displays default padding translation when paddingValue is undefined', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          permaId: 10
        }],
        contentElements: [{sectionId: 1}]
      }
    });

    const section = getSectionByPermaId(10);
    section.select();

    expect(section.getPaddingIndicator('top')).toHaveTextContent('Default');
  });

  it('displays expose motif area translation when motif padding is active', () => {
    useMotifAreaState.mockContentPadded();

    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          permaId: 10
        }],
        contentElements: [{sectionId: 1}]
      }
    });

    const section = getSectionByPermaId(10);
    section.select();

    expect(section.getPaddingIndicator('top')).toHaveTextContent('Expose motif area');
  });
});
