import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import SplitBox from 'frontend/foregroundBoxes/SplitBox';
import styles from 'frontend/foregroundBoxes/SplitBox.module.css';

describe('SplitBox', () => {
  it('renders children', () => {
    const {getByTestId} = render(
      <SplitBox motifAreaState={{paddingTop: 0}}>
        <div data-testid="child" />
      </SplitBox>
    );

    expect(getByTestId('child')).not.toBeNull();
  });

  it('applies paddingTop from motifAreaState', () => {
    const {container} = render(
      <SplitBox motifAreaState={{paddingTop: 100}}>
        <div />
      </SplitBox>
    );

    expect(container.firstChild).toHaveStyle({paddingTop: '100px'});
  });

  it('renders overlay when isContentPadded is true', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: true, paddingTop: 200}}
                inverted={false}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`)).not.toBeNull();
  });

  it('does not render overlay when isContentPadded is false', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: false, paddingTop: 0}}
                inverted={false}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`)).toBeNull();
  });

  it('sets overlay top from paddingTop', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: true, paddingTop: 200}}
                inverted={false}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`))
      .toHaveStyle({top: '200px'});
  });

  it('applies dark overlay class when not inverted', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: true, paddingTop: 0}}
                inverted={false}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`))
      .toHaveClass(styles.overlayDark);
  });

  it('applies light overlay class when inverted', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: true, paddingTop: 0}}
                inverted={true}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`))
      .toHaveClass(styles.overlayLight);
  });

  it('applies backdrop filter when overlayBackdropBlur is set and color is translucent', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: true, paddingTop: 0}}
                inverted={false}
                splitOverlayColor="#ff000080"
                overlayBackdropBlur={50}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`).style.backdropFilter)
      .toBe('blur(5px)');
  });

  it('does not apply backdrop filter when color is opaque', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: true, paddingTop: 0}}
                inverted={false}
                splitOverlayColor="#ff0000"
                overlayBackdropBlur={50}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`).style.backdropFilter)
      .toBeFalsy();
  });

  it('sets overlay background color from splitOverlayColor', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: true, paddingTop: 0}}
                inverted={false}
                splitOverlayColor="#ff000080">
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`))
      .toHaveStyle({backgroundColor: '#ff000080'});
  });
});
