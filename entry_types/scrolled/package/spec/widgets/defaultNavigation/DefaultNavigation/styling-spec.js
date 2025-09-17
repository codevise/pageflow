import React from 'react';

import {DefaultNavigation} from 'widgets/defaultNavigation/DefaultNavigation';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import {act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('DefaultNavigation - Styling', () => {
  useFakeTranslations({});

  afterEach(() => jest.restoreAllMocks());

  it('does not have style attribute on header by default', () => {
    const {container} = renderInEntry(
      <DefaultNavigation configuration={{}} />
    );

    expect(container.querySelector('header')).not.toHaveAttribute('style');
  });

  it('supports overriding accent color', () => {
    const {container} = renderInEntry(
      <DefaultNavigation configuration={{accentColor: 'brand-blue'}} />
    );

    expect(container.querySelector('header')).toHaveStyle(
      {'--theme-accent-color': 'var(--theme-palette-color-brand-blue)'}
    );
  });

  it('toggles data-default-navigation-expanded attribute based on scroll direction', () => {
    // Mock window.scrollY and getBoundingClientRect to simulate scroll positions
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0
    });

    jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({
      top: -window.scrollY,
      left: 0,
      right: 1024,
      bottom: 768 - window.scrollY,
      width: 1024,
      height: 768
    }));

    renderInEntry(
      <DefaultNavigation configuration={{}} />
    );

    expect(document.documentElement).toHaveAttribute('data-default-navigation-expanded');

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(document.documentElement).not.toHaveAttribute('data-default-navigation-expanded');

    act(() => {
      window.scrollY = 50;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(document.documentElement).toHaveAttribute('data-default-navigation-expanded');
  });
});
