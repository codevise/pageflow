import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

describe('Hotspots', () => {
  it('does not render images by default', () => {
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

    const {queryByRole} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );

    expect(queryByRole('img')).toBeNull();
  });

  it('renders image when element should load', () => {
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

    const {getByRole, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} />, {seed}
    );
    simulateScrollPosition('near viewport');

    expect(getByRole('img')).toHaveAttribute('src', '000/000/001/image.webp')
  });
})
