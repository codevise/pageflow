import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';

import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

describe('Hotspots', () => {
  it('renders image', () => {
    const seed = {
      imageFileUrlTemplates: {
        large: ':id_partition/image.webp'
      },
      imageFiles: [
        {id: 1, permaId: 100}
      ]
    };
    const configuration = {
      image: 100
    };

    const {getByRole} = renderInEntry(
      <Hotspots configuration={configuration} />, {seed}
    )

    expect(getByRole('img')).toHaveAttribute('src', '000/000/001/image.webp')
  });
})
