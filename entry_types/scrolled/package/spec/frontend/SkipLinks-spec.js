import React from 'react';

import {SkipLinks} from 'frontend/navigation/SkipLinks';
import styles from 'frontend/navigation/SkipLinks.module.css';

import {render} from '@testing-library/react';

describe('SkipLinks', () => {
  it('renders skip links', async () => {
    const {getByText} = render(<SkipLinks />);

    expect(getByText(/content/).classList.contains(styles.link)).toBe(true);
  });

  it('focus the button', async () => {
    const {container} = render(<SkipLinks />);

    const elem = document.getElementsByClassName(styles.link)[0];
    elem.focus();

    expect(document.activeElement).toBe(elem);
  });
});
