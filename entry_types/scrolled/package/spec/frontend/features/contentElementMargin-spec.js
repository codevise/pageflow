import React from 'react';

import {renderEntry, usePageObjects} from 'support/pageObjects';

import {contentElementWidths as widths, frontend} from 'pageflow-scrolled/frontend';

describe('content element margin', () => {
  usePageObjects();

  it('applies margin to content elements by default', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}],
        contentElements: [{sectionId: 5,
                           typeName: 'withTestId',
                           configuration: {testId: 1}}]
      }
    });

    expect(getContentElementByTestId(1).hasMargin()).toBe(true);
  });

  it('does not apply margin to full width content elements', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}],
        contentElements: [{sectionId: 5,
                           typeName: 'withTestId',
                           configuration: {testId: 1, width: widths.full}}]
      }
    });

    expect(getContentElementByTestId(1).hasMargin()).toBe(false);
  });

  it('does not apply top margin to first content element in section', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}],
        contentElements: [
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 1}},
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 2}}
        ]
      }
    });

    expect(getContentElementByTestId(1).hasTopMargin()).toBe(false);
    expect(getContentElementByTestId(2).hasTopMargin()).toBe(true);
  });

  it('still applies top margin to first content element in cards appearance', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5, configuration: {appearance: 'cards'}}],
        contentElements: [
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 1}},
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 2}}
        ]
      }
    });

    expect(getContentElementByTestId(1).hasTopMargin()).toBe(true);
    expect(getContentElementByTestId(2).hasTopMargin()).toBe(true);
  });

  it('supports defaultMarginTop option in content element registration', () => {
    frontend.contentElementTypes.register('withDefaultMargin', {
      component: function WithDefaultMargin({configuration}) {
        return <div data-testid={`contentElement-${configuration.testId}`} />;
      },
      defaultMarginTop: '1.375rem'
    });

    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5, configuration: {appearance: 'cards'}}],
        contentElements: [
          {sectionId: 5, typeName: 'withDefaultMargin', configuration: {testId: 1}}
        ]
      }
    });

    expect(getContentElementByTestId(1).getMarginTop()).toBe('1.375rem');
  });
});
