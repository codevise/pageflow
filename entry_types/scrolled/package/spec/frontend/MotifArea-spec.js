import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';

import {MotifArea} from 'frontend/MotifArea';

describe('MotifArea', () => {
  it('positions element over image file motif area', () => {
    const {container} =
      renderInEntry(
        <MotifArea imageId={100}
                   containerWidth={2000}
                   containerHeight={1000 }/>,
        {
          seed: {
            imageFiles: [
              {
                permaId: 100,
                width: 200,
                height: 100,
                configuration: {
                  motifArea: {
                    top: 10,
                    left: 10,
                    width: 50,
                    height: 50
                  }
                }
              }
            ]
          }
        }
      );

    expect(container.firstChild).toHaveStyle('top: 100px');
    expect(container.firstChild).toHaveStyle('left: 200px');
    expect(container.firstChild).toHaveStyle('width: 1000px');
    expect(container.firstChild).toHaveStyle('height: 500px');
  });
});
