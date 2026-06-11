import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import areaStyles from 'contentElements/hotspots/Area.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'
import 'support/fakeResizeObserver';

describe('Hotspots', () => {
  it('renders areas with clip path based on area outline', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {outline: [[10, 20], [10, 30], [40, 30], [40, 20]]}
      ]
    };

    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${areaStyles.clip}`)).toHaveStyle(
      'clip-path: polygon(10% 20%, 10% 30%, 40% 30%, 40% 20%)'
    );
  });

  it('supports separate portrait area outline', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    };
    const configuration = {
      image: 100,
      portraitImage: 101,
      areas: [
        {
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          portraitOutline: [[20, 20], [20, 30], [30, 30], [30, 20]]
        }
      ]
    };

    window.matchMedia.mockPortrait();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${areaStyles.clip}`)).toHaveStyle(
      'clip-path: polygon(20% 20%, 20% 30%, 30% 30%, 30% 20%)'
    );
  });

  it('ignores portrait outline if portrait image is missing', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]],
          portraitOutline: [[20, 20], [20, 30], [30, 30], [30, 20]]
        }
      ]
    };

    window.matchMedia.mockPortrait();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(container.querySelector(`.${areaStyles.clip}`)).toHaveStyle(
      'clip-path: polygon(10% 20%, 10% 30%, 40% 30%, 40% 20%)'
    );
  });
});
