import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import areaStyles from 'contentElements/hotspots/Area.module.css';
import imageAreaStyles from 'contentElements/hotspots/ImageArea.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';
import 'support/fakeResizeObserver';

describe('Hotspots', () => {
  it('sets active area id in transient state in editor', async () => {
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
    const setTransientState = jest.fn();

    const user = userEvent.setup();
    const {container} = renderInContentElement(
      <Hotspots configuration={configuration} />,
      {
        seed,
        editorState: {isEditable: true, isSelected: true, setTransientState}
      }
    );
    await user.click(clickableArea(container));

    expect(setTransientState).toHaveBeenCalledWith({activeAreaId: 1})
  });
});

function clickableArea(container) {
  return clickableAreas(container)[0];
}

function clickableAreas(container) {
  return container.querySelectorAll(`div:not(.${imageAreaStyles.area}) > .${areaStyles.clip}`);
}
