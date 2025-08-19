import React from 'react';

import {DefaultNavigation} from 'widgets/defaultNavigation/DefaultNavigation';

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
});