import React from 'react';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import {useContentElementLayoutMatchers} from 'support/matchers';

import {contentElementWidths as widths, frontend} from 'pageflow-scrolled/frontend';

describe('content element margin', () => {
  usePageObjects();
  useContentElementLayoutMatchers();

  it('applies margin to content elements by default', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}],
        contentElements: [{sectionId: 5,
                           typeName: 'withTestId',
                           configuration: {testId: 1}}]
      }
    });

    expect(getContentElementByTestId(1)).toHaveContentElementMargin();
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

    expect(getContentElementByTestId(1)).not.toHaveContentElementMargin();
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

    expect(getContentElementByTestId(1)).toHaveContentElementMargin({topTrimmed: true});
    expect(getContentElementByTestId(2)).toHaveContentElementMargin({topTrimmed: false});
  });

  it('does not trim custom margin top on first content element in section', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}],
        contentElements: [
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 1, marginTop: 'xl'}}
        ]
      }
    });

    expect(getContentElementByTestId(1)).toHaveContentElementMargin({topTrimmed: false});
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

    expect(getContentElementByTestId(1)).toHaveContentElementMargin({topTrimmed: false});
    expect(getContentElementByTestId(2)).toHaveContentElementMargin({topTrimmed: false});
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

    expect(getContentElementByTestId(1)).toHaveContentElementMargin({top: '1.375rem'});
  });

  it('sets margin top via --margin-top custom property', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}],
        contentElements: [
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 1, marginTop: 'xl'}}
        ]
      }
    });

    expect(getContentElementByTestId(1)).toHaveContentElementMargin({top: 'var(--theme-content-element-margin-xl)'});
  });

  it('sets margin bottom via --prev-margin-bottom on next element', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}],
        contentElements: [
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 1, marginBottom: 'lg'}},
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 2}}
        ]
      }
    });

    expect(getContentElementByTestId(1)).toHaveContentElementMargin({bottom: ''});
    expect(getContentElementByTestId(2)).toHaveContentElementMargin({prevBottom: 'var(--theme-content-element-margin-lg)'});
  });

  it('applies --margin-bottom when next element has different width', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}],
        contentElements: [
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 1}},
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 2, marginBottom: 'lg'}},
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 3, width: widths.lg}}
        ]
      }
    });

    expect(getContentElementByTestId(2)).toHaveContentElementMargin({bottom: 'var(--theme-content-element-margin-lg)'});
    expect(getContentElementByTestId(3)).toHaveContentElementMargin({prevBottom: ''});
  });

  it('passes previous inline element margin bottom skipping side elements', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5}],
        contentElements: [
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 1, marginBottom: 'lg'}},
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 2, position: 'side'}},
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 3}}
        ]
      }
    });

    expect(getContentElementByTestId(1)).toHaveContentElementMargin({bottom: ''});
    expect(getContentElementByTestId(2)).toHaveContentElementMargin({prevBottom: ''});
    expect(getContentElementByTestId(3)).toHaveContentElementMargin({prevBottom: 'var(--theme-content-element-margin-lg)'});
  });

  it('sets margin top via --margin-top custom property in center layout', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5, configuration: {layout: 'center'}}],
        contentElements: [
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 1, marginTop: 'xl'}}
        ]
      }
    });

    expect(getContentElementByTestId(1)).toHaveContentElementMargin({top: 'var(--theme-content-element-margin-xl)'});
  });

  it('sets margin bottom via --margin-bottom custom property in center layout', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5, configuration: {layout: 'center'}}],
        contentElements: [
          {sectionId: 5, typeName: 'withTestId', configuration: {testId: 1, marginBottom: 'xl'}}
        ]
      }
    });

    expect(getContentElementByTestId(1)).toHaveContentElementMargin({bottom: 'var(--theme-content-element-margin-xl)'});
  });
});
