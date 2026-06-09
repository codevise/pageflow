import {frontend, ContentElementBox} from 'frontend';

import React from 'react';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import {useContentElementMatchers} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

describe('content element box', () => {
  usePageObjects();
  useContentElementMatchers();

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

    expect(getContentElementByTestId('test')).toContainContentElementBox();
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

    expect(getContentElementByTestId('test')).not.toContainContentElementBox();
  });

  it('applies border radius class when borderRadius prop is provided', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'testRounded'
        }]
      }
    });

    expect(getContentElementByTestId('testRounded')).toContainContentElementBox({borderRadius: 'md'});
  });

  it('does not render box when borderRadius is "none"', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'testNone'
        }]
      }
    });

    expect(getContentElementByTestId('testNone')).not.toContainContentElementBox();
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

    expect(getContentElementByTestId('testBoxShadow')).toContainContentElementBox({boxShadow: 'md'});
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

    expect(getContentElementByTestId('testOutline')).toContainContentElementBox({outlineColor: '#ff0000'});
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

    expect(getContentElementByTestId('testBoxShadowNoBorderRadius'))
      .toContainContentElementBox({boxShadow: 'md'});
  });
});
