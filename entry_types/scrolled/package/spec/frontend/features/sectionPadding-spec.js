import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects';

import '@testing-library/jest-dom/extend-expect';

import {features} from 'pageflow/frontend';
import {usePortraitOrientation} from 'frontend/usePortraitOrientation';
jest.mock('frontend/usePortraitOrientation');

describe('section padding', () => {
  beforeEach(() => {
    features.enable('frontend', ['section_paddings']);
  });

  useInlineEditingPageObjects();

  it('does not suppress top padding by default', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).hasSuppressedTopPadding()).toBe(false);
  });

  it('does not suppress bottom padding by default', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).hasSuppressedBottomPadding()).toBe(false);
  });

  it('suppresses top padding if first content element is full width', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5, configuration: {width: 3}}]
      }
    });

    expect(getSectionByPermaId(6).hasSuppressedTopPadding()).toBe(true);
  });

  it('suppresses bottom padding if last content element is full width', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5, configuration: {width: 3}}]
      }
    });

    expect(getSectionByPermaId(6).hasSuppressedBottomPadding()).toBe(true);
  });

  it('forces padding below full width element if section is selected', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5, configuration: {width: 3}}]
      }
    });

    const section = getSectionByPermaId(6);
    section.select();

    expect(section.hasForcedPadding()).toBe(true);
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

    expect(getSectionByPermaId(6).hasForcedPadding()).toBe(true);
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

    expect(section.hasForcedPadding()).toBe(false);
  });

  it('does not set inline padding styles when no paddingTop/paddingBottom set', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).el).not.toHaveStyle({
      '--foreground-padding-top': expect.anything(),
    });
    expect(getSectionByPermaId(6).el).not.toHaveStyle({
      '--foreground-padding-bottom': expect.anything(),
    });
  });

  it('supports setting custom foreground padding', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 5,
          permaId: 6,
          configuration: {
            paddingTop: 'lg',
            paddingBottom: 'md'
          }
        }],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).el).toHaveStyle({
      '--foreground-padding-top': 'var(--theme-section-padding-top-lg)',
      '--foreground-padding-bottom': 'var(--theme-section-padding-bottom-md)',
    });
  });

  it('supports portrait custom foreground padding', () => {
    usePortraitOrientation.mockReturnValue(true);

    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 5,
          permaId: 6,
          configuration: {
            paddingTop: 'lg',
            paddingBottom: 'md',
            portraitPaddingTop: 'sm',
            portraitPaddingBottom: 'xs'
          }
        }],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).el).toHaveStyle({
      '--foreground-padding-top': 'var(--theme-section-padding-top-sm)',
      '--foreground-padding-bottom': 'var(--theme-section-padding-bottom-xs)',
    });
  });

  it('falls back to default padding if portrait padding not configured', () => {
    usePortraitOrientation.mockReturnValue(true);

    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 5,
          permaId: 6,
          configuration: {
            paddingTop: 'lg',
            paddingBottom: 'md'
          }
        }],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).el).toHaveStyle({
      '--foreground-padding-top': 'var(--theme-section-padding-top-lg)',
      '--foreground-padding-bottom': 'var(--theme-section-padding-bottom-md)',
    });
  });

  it('centers content vertically by default', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5}]
      }
    });

    const section = getSectionByPermaId(6);
    expect(section.hasRemainingSpaceAbove()).toBe(false);
    expect(section.hasRemainingSpaceBelow()).toBe(false);
  });

  it('supports remaining vertical space above content', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 5,
          permaId: 6,
          configuration: {remainingVerticalSpace: 'above'}
        }],
        contentElements: [{sectionId: 5}]
      }
    });

    const section = getSectionByPermaId(6);
    expect(section.hasRemainingSpaceAbove()).toBe(true);
    expect(section.hasRemainingSpaceBelow()).toBe(false);
  });

  it('supports remaining vertical space below content', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 5,
          permaId: 6,
          configuration: {remainingVerticalSpace: 'below'}
        }],
        contentElements: [{sectionId: 5}]
      }
    });

    const section = getSectionByPermaId(6);
    expect(section.hasRemainingSpaceAbove()).toBe(false);
    expect(section.hasRemainingSpaceBelow()).toBe(true);
  });
});
