import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {ContentElementVisualization} from 'editor/views/inputs/visualizations/ContentElementVisualization';

import styles from 'editor/views/inputs/visualizations/ContentElementVisualization.module.css';

describe('ContentElementVisualization', () => {
  it('applies classes for position and layout', () => {
    const {container} = render(<ContentElementVisualization position="side" layout="center" />);

    expect(container.firstChild).toHaveClass(styles.sidePosition, styles.centerLayout);
  });

  it('renders children inside the rect representing the element', () => {
    const {getByTestId} = render(
      <ContentElementVisualization position="inline">
        <span data-testid="overlay" />
      </ContentElementVisualization>
    );

    expect(getByTestId('overlay').parentElement).toHaveClass(styles.block);
  });
});
