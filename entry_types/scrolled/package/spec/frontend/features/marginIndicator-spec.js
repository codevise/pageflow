import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects';
import {fakeParentWindow} from 'support';
import {features} from 'pageflow/frontend';
import '@testing-library/jest-dom/extend-expect';

describe('MarginIndicator', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    fakeParentWindow();
    features.enable('frontend', ['content_element_margins']);
  });

  it('displays scale translation for top margin when element is selected', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 1}],
        contentElements: [{
          sectionId: 1,
          typeName: 'withTestId',
          configuration: {
            testId: 'test',
            marginTop: 'lg'
          }
        }],
        themeOptions: {
          properties: {
            root: {
              'contentElementMargin-lg': '50px'
            }
          }
        },
        themeTranslations: {
          scales: {
            contentElementMargin: {
              lg: 'Large'
            }
          }
        }
      }
    });

    const contentElement = getContentElementByTestId('test');
    contentElement.select();

    expect(contentElement.getMarginIndicator('top')).toHaveTextContent('Large');
  });

  it('displays scale translation for bottom margin when element is selected', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 1}],
        contentElements: [{
          sectionId: 1,
          typeName: 'withTestId',
          configuration: {
            testId: 'test',
            marginBottom: 'md'
          }
        }],
        themeOptions: {
          properties: {
            root: {
              'contentElementMargin-md': '30px'
            }
          }
        },
        themeTranslations: {
          scales: {
            contentElementMargin: {
              md: 'Medium'
            }
          }
        }
      }
    });

    const contentElement = getContentElementByTestId('test');
    contentElement.select();

    expect(contentElement.getMarginIndicator('bottom')).toHaveTextContent('Medium');
  });

  it('does not render indicators when no margin is configured', () => {
    const {getContentElementByTestId, container} = renderEntry({
      seed: {
        sections: [{id: 1}],
        contentElements: [{
          sectionId: 1,
          typeName: 'withTestId',
          configuration: {
            testId: 'test'
          }
        }]
      }
    });

    const contentElement = getContentElementByTestId('test');
    contentElement.select();

    expect(container.querySelector('[aria-label="Top margin"]')).toBeNull();
    expect(container.querySelector('[aria-label="Bottom margin"]')).toBeNull();
  });

  it('does not render indicator for unknown margin value', () => {
    const {getContentElementByTestId, container} = renderEntry({
      seed: {
        sections: [{id: 1}],
        contentElements: [{
          sectionId: 1,
          typeName: 'withTestId',
          configuration: {
            testId: 'test',
            marginTop: 'unknown'
          }
        }],
        themeOptions: {
          properties: {
            root: {
              'contentElementMargin-sm': '10px'
            }
          }
        },
        themeTranslations: {
          scales: {
            contentElementMargin: {
              sm: 'Small'
            }
          }
        }
      }
    });

    const contentElement = getContentElementByTestId('test');
    contentElement.select();

    expect(container.querySelector('[aria-label="Top margin"]')).toBeNull();
  });

  it('does not render indicators when element is not selected', () => {
    const {container} = renderEntry({
      seed: {
        sections: [{id: 1}],
        contentElements: [{
          sectionId: 1,
          typeName: 'withTestId',
          configuration: {
            testId: 'test',
            marginTop: 'lg'
          }
        }],
        themeOptions: {
          properties: {
            root: {
              'contentElementMargin-lg': '50px'
            }
          }
        },
        themeTranslations: {
          scales: {
            contentElementMargin: {
              lg: 'Large'
            }
          }
        }
      }
    });

    expect(container.querySelector('[aria-label="Top margin"]')).toBeNull();
  });
});
