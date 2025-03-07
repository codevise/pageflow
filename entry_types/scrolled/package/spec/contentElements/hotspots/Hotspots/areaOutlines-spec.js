import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'
import 'support/fakeResizeObserver';

describe('Hotspots', () => {
  it('does not render area outline as svg by default', () => {
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

    expect(container.querySelector('svg polygon')).toBeNull();
  });

  it('renders area outline as svg when selected in editor', () => {
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
      <Hotspots configuration={configuration} />,
      {
        seed,
        editorState: {isSelected: true, isEditable: true}
      }
    );

    expect(container.querySelector('svg polygon')).toHaveAttribute(
      'points',
      '10,20 10,30 40,30 40,20'
    )
  });
});
