import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
  ContentElementVisualization,
  measureElementTop,
  measureScrollTimeline,
  measureViewTimelineProgress
} from 'editor/views/inputs/visualizations/ContentElementVisualization';

import {fakeBoundingClientRectsByClassName} from 'support/fakeBoundingClientRects';

import styles from 'editor/views/inputs/visualizations/ContentElementVisualization.module.css';

describe('ContentElementVisualization', () => {
  it('applies classes for position and layout', () => {
    const {container} = render(<ContentElementVisualization position="side" layout="center" />);

    expect(container.firstChild).toHaveClass(styles.sidePosition, styles.centerLayout);
  });

  it('optionally narrows the rect representing the element', () => {
    const {container} = render(<ContentElementVisualization position="inline" narrowBlock />);

    expect(container.firstChild).toHaveClass(styles.narrowBlock);
  });

  it('optionally adds room to scroll around the section content', () => {
    const {container} = render(<ContentElementVisualization position="inline" scrollRoom />);

    expect(container.firstChild).toHaveClass(styles.scrollRoom);
  });

  it('optionally marks the center of the viewport', () => {
    const {container} = render(<ContentElementVisualization position="inline" viewportCenter />);

    expect(container.querySelector(`.${styles.viewportCenter}`)).not.toBeNull();
  });

  it('does not mark the center of the viewport by default', () => {
    const {container} = render(<ContentElementVisualization position="inline" />);

    expect(container.querySelector(`.${styles.viewportCenter}`)).toBeNull();
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

describe('measureViewTimelineProgress', () => {
  afterEach(() => jest.restoreAllMocks());

  function renderPreview(position) {
    const {container} = render(<ContentElementVisualization position={position} />);
    return container.firstChild;
  }

  it('measures the element along the visualization acting as viewport', () => {
    fakeBoundingClientRectsByClassName({
      [styles.visualization]: {top: 200, height: 100},
      [styles.block]: {top: 240, height: 20}
    });

    const progress = measureViewTimelineProgress({
      scroller: renderPreview('inline'),
      position: 'inline',
      range: 'cover'
    });

    expect(progress).toEqual(0.5);
  });

  it('measures sticky elements along the group that scrolls past them', () => {
    fakeBoundingClientRectsByClassName(
      {
        [styles.visualization]: {top: 0, height: 100},
        [styles.wrapper]: {top: 40, height: 20}
      },
      {otherElements: {top: 0, height: 200}}
    );

    const progress = measureViewTimelineProgress({
      scroller: renderPreview('sticky'),
      position: 'sticky',
      range: 'inFocus'
    });

    expect(progress).toEqual(40 / 180);
  });
});

describe('measureElementTop', () => {
  afterEach(() => jest.restoreAllMocks());

  function elementTop(position, rects, options) {
    fakeBoundingClientRectsByClassName(rects, options);

    const {container} = render(<ContentElementVisualization position={position} />);

    return measureElementTop({scroller: container.firstChild, position});
  }

  it('measures in fractions of the height of the visualization', () => {
    expect(elementTop('inline', {
      [styles.visualization]: {top: 200, height: 100},
      [styles.block]: {top: 250, height: 20}
    })).toEqual(0.5);
  });

  it('measures the element itself for positions that pin it', () => {
    expect(elementTop(
      'sticky',
      {
        [styles.visualization]: {top: 0, height: 100},
        [styles.wrapper]: {top: 40, height: 20}
      },
      {otherElements: {top: 0, height: 200}}
    )).toEqual(0.4);
  });
});

describe('measureScrollTimeline', () => {
  afterEach(() => jest.restoreAllMocks());

  function scrollTimeline(rects, options) {
    fakeBoundingClientRectsByClassName(rects);

    const {container} = render(<ContentElementVisualization position="inline" />);

    return measureScrollTimeline({scroller: container.firstChild, position: 'inline', ...options});
  }

  it('spans from element about to enter until it has left the viewport', () => {
    expect(scrollTimeline({
      [styles.visualization]: {top: 0, height: 100},
      [styles.block]: {top: 150, height: 20}
    })).toEqual({from: 50, to: 170});
  });

  it('optionally ends once the top edge of the element has reached an offset', () => {
    expect(scrollTimeline({
      [styles.visualization]: {top: 0, height: 100},
      [styles.block]: {top: 150, height: 20}
    }, {until: 0.4})).toEqual({from: 50, to: 110});
  });

  it('starts at the top if there is not enough room above', () => {
    expect(scrollTimeline({
      [styles.visualization]: {top: 0, height: 100},
      [styles.block]: {top: 40, height: 20}
    })).toEqual({from: 0, to: 60});
  });
});
