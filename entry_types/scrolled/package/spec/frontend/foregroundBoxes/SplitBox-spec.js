import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import SplitBox from 'frontend/foregroundBoxes/SplitBox';
import styles from 'frontend/foregroundBoxes/SplitBox.module.css';

const transitionStyles = {foregroundOpacity: 'foregroundOpacity'};

describe('SplitBox', () => {
  it('renders children', () => {
    const {getByTestId} = render(
      <SplitBox motifAreaState={{paddingTop: 0}}
                transitionStyles={transitionStyles}>
        <div data-testid="child" />
      </SplitBox>
    );

    expect(getByTestId('child')).not.toBeNull();
  });

  it('applies paddingTop from motifAreaState', () => {
    const {container} = render(
      <SplitBox motifAreaState={{paddingTop: 100}}
                transitionStyles={transitionStyles}>
        <div />
      </SplitBox>
    );

    expect(container.firstChild).toHaveStyle({paddingTop: '100px'});
  });

  it('renders overlay when isContentPadded is true', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: true, paddingTop: 200}}
                transitionStyles={transitionStyles}
                inverted={false}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`)).not.toBeNull();
  });

  it('does not render overlay when isContentPadded is false', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: false, paddingTop: 0}}
                transitionStyles={transitionStyles}
                inverted={false}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`)).toBeNull();
  });

  it('sets overlay top from paddingTop', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: true, paddingTop: 200}}
                transitionStyles={transitionStyles}
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
                transitionStyles={transitionStyles}
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
                transitionStyles={transitionStyles}
                inverted={true}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`))
      .toHaveClass(styles.overlayLight);
  });

  it('applies foregroundOpacity class to overlay', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: true, paddingTop: 0}}
                transitionStyles={transitionStyles}
                inverted={false}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.overlay}`))
      .toHaveClass('foregroundOpacity');
  });

  it('applies foregroundOpacity class to content', () => {
    const {container} = render(
      <SplitBox motifAreaState={{paddingTop: 0}}
                transitionStyles={transitionStyles}>
        <div />
      </SplitBox>
    );

    expect(container.querySelector(`.${styles.content}`))
      .toHaveClass('foregroundOpacity');
  });

  it('applies overlay style to overlay element', () => {
    const {container} = render(
      <SplitBox motifAreaState={{isContentPadded: true, paddingTop: 0}}
                transitionStyles={transitionStyles}
                inverted={false}
                overlayStyle={{backgroundColor: '#ff000080', backdropFilter: 'blur(5px)'}}>
        <div />
      </SplitBox>
    );

    const overlay = container.querySelector(`.${styles.overlay}`);
    expect(overlay).toHaveStyle({backgroundColor: '#ff000080'});
    expect(overlay.style.backdropFilter).toBe('blur(5px)');
  });
});
