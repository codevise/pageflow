import React from 'react';

import {DefaultNavigation} from 'widgets/defaultNavigation/DefaultNavigation';

import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect';

describe('DefaultNavigation', () => {
  it('does not have style attribute on header by default', async () => {
    const {container} = renderInEntry(
      <DefaultNavigation configuration={{}} />
    );

    expect(container.querySelector('header')).not.toHaveAttribute('style');
  });

  it('supports overriding accent color', async () => {
    const {container} = renderInEntry(
      <DefaultNavigation configuration={{accentColor: 'brand-blue'}} />
    );

    expect(container.querySelector('header')).toHaveStyle(
      {'--theme-accent-color': 'var(--theme-palette-color-brand-blue)'
    });
  });
});
