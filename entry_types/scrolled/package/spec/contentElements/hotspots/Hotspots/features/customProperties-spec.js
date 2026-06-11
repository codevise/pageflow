import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import styles from 'contentElements/hotspots/Hotspots.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

import 'support/animateStub';
import {fakeResizeObserver} from 'support/fakeResizeObserver';
import 'support/scrollTimelineStub';

describe('Hotspots', () => {
  it('sets custom property with container height', () => {
    const configuration = {};

    fakeResizeObserver.contentRect = {width: 200, height: 100};
    const {container, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />,
    );
    simulateScrollPosition('near viewport');

    expect(container.querySelector(`.${styles.tooltipsWrapper}`)).toHaveStyle({
      '--hotspots-container-height': '100px'
    });
  });

  it('sets custom property with image aspect ratio', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100, width: 2000, height: 1000}]
    };
    const configuration = {
      image: 100
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${styles.tooltipsWrapper}`)).toHaveStyle({
      '--hotspots-image-aspect-ratio': '2000 / 1000'
    });
  });

  it('sets custom property with image aspect ratio of portrait image', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [
        {id: 1, permaId: 100, width: 2000, height: 1000},
        {id: 2, permaId: 101, width: 1000, height: 2000}
      ]
    };
    const configuration = {
      image: 100,
      portraitImage: 101
    };

    window.matchMedia.mockPortrait();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${styles.tooltipsWrapper}`)).toHaveStyle({
      '--hotspots-image-aspect-ratio': '1000 / 2000'
    });
  });
});
