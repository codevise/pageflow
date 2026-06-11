import React from 'react';

import {DefaultNavigation} from 'widgets/defaultNavigation/DefaultNavigation';

import styles from 'widgets/defaultNavigation/DefaultNavigation.module.css';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect';

describe('DefaultNavigation - Styling', () => {
  useFakeTranslations({});

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

  it('has translucent surface by default', () => {
    const {container} = renderInEntry(
      <DefaultNavigation configuration={{}} />
    );

    const wrapper = container.querySelector('header > div');
    expect(wrapper).toHaveClass(styles.translucentSurface);
    expect(wrapper).not.toHaveClass(styles.opaqueSurface);
  });

  it('has opaque surface when firstBackdropBelowNavigation is set', () => {
    const {container} = renderInEntry(
      <DefaultNavigation configuration={{firstBackdropBelowNavigation: true}} />
    );

    const wrapper = container.querySelector('header > div');
    expect(wrapper).toHaveClass(styles.opaqueSurface);
    expect(wrapper).not.toHaveClass(styles.translucentSurface);
  });
});
