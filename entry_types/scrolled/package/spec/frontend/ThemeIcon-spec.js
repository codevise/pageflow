import React from 'react';

import {ThemeIcon} from 'pageflow-scrolled/frontend';

import {renderInEntry} from '../support';
import '@testing-library/jest-dom/extend-expect';

describe("ThemeIcon", () => {
  it('renders fallback icon by default', () => {
    const {container} = renderInEntry(<ThemeIcon name="share" />);

    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('data-file-name', 'SvgShare')
  });

  it('throws error for unknwon icon', () => {
    expect(() =>
      renderInEntry(<ThemeIcon name="not-there" />)
    ).toThrowError(/Unknown icon/);
  });

  it('renders custom theme icon if present', () => {
    const {container} = renderInEntry(<ThemeIcon name="share" />, {
      seed: {
        themeAssets: {
          icons: {share: '/path/to/custom-share.svg'}
        }
      }
    });

    const svg = container.querySelector('svg use');

    expect(svg).toHaveAttribute('xlink:href', '/path/to/custom-share.svg#icon')
  });
});
