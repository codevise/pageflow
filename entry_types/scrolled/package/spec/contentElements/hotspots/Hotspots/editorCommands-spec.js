import React from 'react';

import {Hotspots} from 'contentElements/hotspots/Hotspots';
import areaStyles from 'contentElements/hotspots/Area.module.css';
import tooltipStyles from 'contentElements/hotspots/Tooltip.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'
import 'support/fakeResizeObserver';

jest.mock('contentElements/hotspots/TooltipPortal');
jest.mock('contentElements/hotspots/useTooltipTransitionStyles');

describe('Hotspots', () => {
  it('supports highlighting area via command', () => {
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

    const {container, triggerEditorCommand} = renderInContentElement(
      <Hotspots configuration={configuration} contentElementId={1} />,
      {
        seed,
        editorState: {isSelected: true, isEditable: true}
      }
    );
    triggerEditorCommand({type: 'HIGHLIGHT_AREA', index: 0});

    expect(container.querySelector(`.${areaStyles.area}`)).toHaveClass(areaStyles.highlighted);
  });

  it('supports resetting area highlight via command', () => {
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

    const {container, triggerEditorCommand} = renderInContentElement(
      <Hotspots configuration={configuration} contentElementId={1} />,
      {
        seed,
        editorState: {isSelected: true, isEditable: true}
      }
    );
    triggerEditorCommand({type: 'HIGHLIGHT_AREA', index: 0});
    triggerEditorCommand({type: 'RESET_AREA_HIGHLIGHT'});

    expect(container.querySelector(`.${areaStyles.area}`)).not.toHaveClass(areaStyles.highlighted);
  });

  it('supports setting active area via command', () => {
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

    const {container, triggerEditorCommand, simulateScrollPosition} = renderInContentElement(
      <Hotspots configuration={configuration} contentElementId={1} />,
      {
        seed,
        editorState: {isSelected: true, isEditable: true}
      }
    );
    simulateScrollPosition('near viewport');
    triggerEditorCommand({type: 'SET_ACTIVE_AREA', index: 0});

    expect(container.querySelector(`.${tooltipStyles.box}`)).not.toBeNull();
  });
});
