import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'
import {fakeResizeObserver} from 'support/fakeResizeObserver';

describe('Hotspots', () => {
  it('does not observe resize by default', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        }
      ]
    };

    renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(fakeResizeObserver.observe).not.toHaveBeenCalled();
  });

  it('observes resize when near viewport', () => {
    const seed = {
      imageFileUrlTemplates: {large: ':id_partition/image.webp'},
      imageFiles: [{id: 1, permaId: 100}]
    };
    const configuration = {
      image: 100,
      areas: [
        {
          id: 1,
          outline: [[10, 20], [10, 30], [40, 30], [40, 20]]
        }
      ]
    };

    const {simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(fakeResizeObserver.observe).toHaveBeenCalledTimes(1);
    expect(fakeResizeObserver.observe).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});
