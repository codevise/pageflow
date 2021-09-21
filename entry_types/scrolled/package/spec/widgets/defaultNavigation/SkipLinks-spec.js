import React from 'react';

import {SkipLinks} from 'widgets/defaultNavigation/SkipLinks';
import styles from 'widgets/defaultNavigation/SkipLinks.module.css';

import {render} from '@testing-library/react';

describe('SkipLinks', () => {
  it('renders skip links', async () => {
    const {getByText} = render(<SkipLinks />);

    expect(getByText(/content/).classList.contains(styles.link)).toBe(true);
  });
});
