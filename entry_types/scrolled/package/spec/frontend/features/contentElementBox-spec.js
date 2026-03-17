import {frontend, ContentElementBox} from 'frontend';

import React from 'react';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('content element box', () => {
  usePageObjects();

  beforeEach(() => {
    frontend.contentElementTypes.register('test', {
      component: function Component() {
        return (
          <div data-testid="contentElement-test">
            <ContentElementBox>
              Some content
            </ContentElementBox>
          </div>
        )
      }
    });

    frontend.contentElementTypes.register('testRounded', {
      component: function Component() {
        return (
          <div data-testid="contentElement-testRounded">
            <ContentElementBox borderRadius="md">
              Some content with rounded corners
            </ContentElementBox>
          </div>
        )
      }
    });

    frontend.contentElementTypes.register('testNone', {
      component: function Component() {
        return (
          <div data-testid="contentElement-testNone">
            <ContentElementBox borderRadius="none">
              Some content with no box wrapper
            </ContentElementBox>
          </div>
        )
      }
    });

    frontend.contentElementTypes.register('testBoxShadow', {
      component: function Component({configuration}) {
        return (
          <div data-testid="contentElement-testBoxShadow">
            <ContentElementBox configuration={configuration}>
              Some content with box shadow
            </ContentElementBox>
          </div>
        )
      }
    });

    frontend.contentElementTypes.register('testOutline', {
      component: function Component({configuration}) {
        return (
          <div data-testid="contentElement-testOutline">
            <ContentElementBox configuration={configuration}>
              Some content with outline
            </ContentElementBox>
          </div>
        )
      }
    });

    frontend.contentElementTypes.register('testBoxShadowNoBorderRadius', {
      component: function Component({configuration}) {
        return (
          <div data-testid="contentElement-testBoxShadowNoBorderRadius">
            <ContentElementBox borderRadius="none" configuration={configuration}>
              Box shadow without border radius
            </ContentElementBox>
          </div>
        )
      }
    });
  });

  it('renders box', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'test'
        }]
      }
    });

    expect(getContentElementByTestId('test').containsBox()).toEqual(true);
  });

  it('does not render box for backdrop content element', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          configuration: {
            backdrop: {
              contentElement: 10
            }
          }
        }],
        contentElements: [{
          sectionId: 1,
          permaId: 10,
          typeName: 'test',
          configuration: {position: 'backdrop'}
        }]
      }
    });

    expect(getContentElementByTestId('test').containsBox()).toEqual(false);
  });

  it('applies border radius class when borderRadius prop is provided', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'testRounded'
        }]
      }
    });

    const contentElement = getContentElementByTestId('testRounded');
    expect(contentElement.hasBoxBorderRadius('md')).toBe(true);
  });

  it('does not render box when borderRadius is "none"', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'testNone'
        }]
      }
    });

    expect(getContentElementByTestId('testNone').containsBox()).toEqual(false);
  });

  it('applies box shadow CSS custom property from configuration', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'testBoxShadow',
          configuration: {boxShadow: 'md'}
        }]
      }
    });

    expect(getContentElementByTestId('testBoxShadow').hasBoxShadow('md')).toBe(true);
  });

  it('applies outline color CSS custom property from configuration', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'testOutline',
          configuration: {outlineColor: '#ff0000'}
        }]
      }
    });

    expect(getContentElementByTestId('testOutline').hasOutlineColor('#ff0000')).toBe(true);
  });

  it('renders box when borderRadius is "none" but configuration has boxShadow', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'testBoxShadowNoBorderRadius',
          configuration: {boxShadow: 'md'}
        }]
      }
    });

    expect(getContentElementByTestId('testBoxShadowNoBorderRadius').containsBox()).toEqual(true);
    expect(getContentElementByTestId('testBoxShadowNoBorderRadius').hasBoxShadow('md')).toBe(true);
  });
});
