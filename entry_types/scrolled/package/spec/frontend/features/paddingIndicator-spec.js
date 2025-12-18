import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects';
import {fakeParentWindow} from 'support';
import {useMotifAreaState} from 'frontend/v1/useMotifAreaState';
import {features} from 'pageflow/frontend';
import '@testing-library/jest-dom/extend-expect';

jest.mock('frontend/v1/useMotifAreaState');

describe('PaddingIndicator', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    fakeParentWindow();
    features.enable('frontend', ['section_paddings']);
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

  it('displays suppressed text for top padding when section starts with full width element', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          permaId: 10
        }],
        contentElements: [{sectionId: 1, configuration: {width: 3}}]
      }
    });

    const section = getSectionByPermaId(10);
    section.select();

    expect(section.getPaddingIndicator('top')).toHaveTextContent('Padding suppressed before full width element');
  });

  it('displays suppressed text for bottom padding when section ends with full width element', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          permaId: 10
        }],
        contentElements: [{sectionId: 1, configuration: {width: 3}}]
      }
    });

    const section = getSectionByPermaId(10);
    section.select();

    expect(section.getPaddingIndicator('bottom')).toHaveTextContent('Padding suppressed after full width element');
  });

  it('applies none class to padding indicator when padding is suppressed', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          permaId: 10
        }],
        contentElements: [{sectionId: 1, configuration: {width: 3}}]
      }
    });

    const section = getSectionByPermaId(10);
    section.select();

    expect(section.getPaddingIndicator('top').className).toContain('none');
  });

  it('applies none class to padding indicator when padding value is none', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          permaId: 10,
          configuration: {
            paddingTop: 'none'
          }
        }],
        contentElements: [{sectionId: 1}]
      }
    });

    const section = getSectionByPermaId(10);
    section.select();

    expect(section.getPaddingIndicator('top').className).toContain('none');
  });
});
