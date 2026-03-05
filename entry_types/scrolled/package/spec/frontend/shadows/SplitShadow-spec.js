import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import SplitShadow from 'frontend/shadows/SplitShadow';
import styles from 'frontend/shadows/SplitShadow.module.css';

describe('SplitShadow', () => {
  const defaultProps = {
    align: 'left',
    inverted: false,
    motifAreaState: {isContentPadded: false}
  };

  it('renders overlay and children', () => {
    const {container} = render(
      <SplitShadow {...defaultProps}>
        <div data-testid="child" />
      </SplitShadow>
    );

    expect(container.querySelector(`.${styles.overlay}`)).not.toBeNull();
    expect(container.querySelector('[data-testid="child"]')).not.toBeNull();
  });

  it('applies left alignment class', () => {
    const {container} = render(
      <SplitShadow {...defaultProps} align="left">
        <div />
      </SplitShadow>
    );

    expect(container.firstChild).toHaveClass(styles['align-left']);
  });

  it('applies right alignment class', () => {
    const {container} = render(
      <SplitShadow {...defaultProps} align="right">
        <div />
      </SplitShadow>
    );

    expect(container.firstChild).toHaveClass(styles['align-right']);
  });

  it('applies center alignment class', () => {
    const {container} = render(
      <SplitShadow {...defaultProps} align="center">
        <div />
      </SplitShadow>
    );

    expect(container.firstChild).toHaveClass(styles['align-center']);
  });

  it('applies dark class when not inverted', () => {
    const {container} = render(
      <SplitShadow {...defaultProps} inverted={false}>
        <div />
      </SplitShadow>
    );

    expect(container.firstChild).toHaveClass(styles.dark);
  });

  it('applies light class when inverted', () => {
    const {container} = render(
      <SplitShadow {...defaultProps} inverted={true}>
        <div />
      </SplitShadow>
    );

    expect(container.firstChild).toHaveClass(styles.light);
  });

  it('sets background color from splitSurfaceColor prop', () => {
    const {container} = render(
      <SplitShadow {...defaultProps} splitSurfaceColor="#ff000080">
        <div />
      </SplitShadow>
    );

    expect(container.querySelector(`.${styles.overlay}`))
      .toHaveStyle({backgroundColor: '#ff000080'});
  });

  it('does not set inline background color when no splitSurfaceColor', () => {
    const {container} = render(
      <SplitShadow {...defaultProps}>
        <div />
      </SplitShadow>
    );

    expect(container.querySelector(`.${styles.overlay}`).style.backgroundColor)
      .toBe('');
  });

  it('does not render overlay when isContentPadded is true', () => {
    const {container} = render(
      <SplitShadow {...defaultProps}
                    motifAreaState={{isContentPadded: true}}>
        <div />
      </SplitShadow>
    );

    expect(container.querySelector(`.${styles.overlay}`)).toBeNull();
  });

  it('renders children when isContentPadded is true', () => {
    const {container} = render(
      <SplitShadow {...defaultProps}
                    motifAreaState={{isContentPadded: true}}>
        <div data-testid="child" />
      </SplitShadow>
    );

    expect(container.querySelector('[data-testid="child"]')).not.toBeNull();
  });
});
