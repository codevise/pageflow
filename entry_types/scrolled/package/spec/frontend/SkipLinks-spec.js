import React from 'react';

import {SkipLinks} from 'frontend/navigation/SkipLinks';
import styles from 'frontend/navigation/SkipLinks.module.css';

import {render} from '@testing-library/react';
import {fireEvent} from '@testing-library/dom';

describe('SkipLinks', () => {
  it('renders skip links', async () => {
    const {getByText} = render(<SkipLinks />);

    expect(getByText(/content/).classList.contains(styles.link)).toBe(true);
  });

  it('display the button on tab press', async () => {
    const {getByText} = render(<SkipLinks />);

    fireEvent.keyDown(getByText(/content/), {keyCode: 9});

    expect(document.getElementsByClassName(styles.skipLinks)[0].classList.contains(styles.hidden)).toBe(false);
  });

  it('hide the button on enter press', async () => {
    const {getByText} = render(<SkipLinks />);

    fireEvent.keyDown(getByText(/content/), {keyCode: 9});
    fireEvent.keyDown(getByText(/content/), {keyCode: 13});

    expect(document.getElementsByClassName(styles.skipLinks)[0].classList.contains(styles.hidden)).toBe(true);
  });

  it('hide the button on click', async () => {
    const {getByText} = render(<SkipLinks />);

    fireEvent.keyDown(getByText(/content/), {keyCode: 9});
    fireEvent.mouseDown(getByText(/content/));

    expect(document.getElementsByClassName(styles.skipLinks)[0].classList.contains(styles.hidden)).toBe(true);
  });
});
