import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('transitions', () => {
  usePageObjects();

  it('applies foreground-above and foreground-below classes when scrolling middle section into view', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [
          {
            permaId: 1,
            configuration: {
              transition: 'fade',
              fullHeight: true
            }
          },
          {
            permaId: 2,
            configuration: {
              transition: 'fade',
              fullHeight: true
            }
          },
          {
            permaId: 3,
            configuration: {
              transition: 'fade',
              fullHeight: true
            }
          }
        ]
      }
    });

    getSectionByPermaId(2).simulateScrollingIntoView();

    expect(getSectionByPermaId(1).hasFadedOutForeground()).toBe(true);
    expect(getSectionByPermaId(2).hasFadedOutForeground()).toBe(false);
    expect(getSectionByPermaId(3).hasFadedOutForeground()).toBe(true);
  });
});
