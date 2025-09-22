import React from 'react';

import {ClassicPlayerControls, WaveformPlayerControls} from 'frontend/PlayerControls';

import '@testing-library/jest-dom/extend-expect'
import {fireEvent} from '@testing-library/react'
import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'support';
import * as queries from 'support/roleQueriesExcludingInert';

describe('PlayerControls', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.player_controls.play': 'Play',
    'pageflow_scrolled.public.player_controls.text_tracks': 'Text Tracks'
  });

  [ClassicPlayerControls, WaveformPlayerControls].forEach((PlayerControlComponent)=>{
    it('supports onFocus prop', () => {
      const listener = jest.fn();
      const {getByRole} = renderInEntry(<PlayerControlComponent onFocus={listener} />,
                                        {queries});

      getByRole('button', {name: 'Play'}).focus();

      expect(listener).toHaveBeenCalled();
    });

    it('supports onBlur prop', () => {
      const listener = jest.fn();
      const {getByRole} = renderInEntry(<PlayerControlComponent onBlur={listener} />,
                                        {queries});

      getByRole('button', {name: 'Play'}).focus();
      getByRole('button', {name: 'Play'}).blur();

      expect(listener).toHaveBeenCalled();
    });

    it('supports onMouseEnter prop', () => {
      const listener = jest.fn();
      const {getByRole} = renderInEntry(<PlayerControlComponent onMouseEnter={listener} />,
                                        {queries});

      fireEvent.mouseEnter(getByRole('button', {name: 'Play'}));

      expect(listener).toHaveBeenCalled();
    });

    it('supports onMouseLeave prop', () => {
      const listener = jest.fn();
      const {getByRole} = renderInEntry(<PlayerControlComponent onMouseLeave={listener} />,
                                        {queries});

      fireEvent.mouseLeave(getByRole('button', {name: 'Play'}));

      expect(listener).toHaveBeenCalled();

    });

    it('supports rendering and handling events for text track menu items', () => {
      const listener = jest.fn();
      const {getByTitle, getByText} = renderInEntry(
        <PlayerControlComponent
            textTracksMenuItems={[
              {label: 'German', value: 'de'},
              {label: 'English', value: 'en'},
            ]}
            onTextTracksMenuItemClick={listener} />
      );

      fireEvent.click(getByTitle('Text Tracks'));
      fireEvent.click(getByText('English'));

      expect(listener).toHaveBeenCalledWith('en');
    });
  });
});
