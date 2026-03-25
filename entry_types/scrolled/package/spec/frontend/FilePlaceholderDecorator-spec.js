import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {FilePlaceholder} from 'frontend/FilePlaceholderDecorator';
import styles from 'frontend/Placeholder.module.css';

describe('FilePlaceholder', () => {
  it('renders placeholder when no file is given', () => {
    const {container} = render(
      <FilePlaceholder />
    );

    expect(container.querySelector(`.${styles.placeholder}`)).not.toBeNull();
  });

  it('renders placeholder when file is not ready', () => {
    const {container} = render(
      <FilePlaceholder file={{isReady: false}} />
    );

    expect(container.querySelector(`.${styles.placeholder}`)).not.toBeNull();
  });

  it('does not render placeholder when file is ready', () => {
    const {container} = render(
      <FilePlaceholder file={{isReady: true}} />
    );

    expect(container.querySelector(`.${styles.placeholder}`)).toBeNull();
  });
});
