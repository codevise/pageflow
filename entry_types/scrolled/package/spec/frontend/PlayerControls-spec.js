import React from 'react';

import {ClassicPlayerControls, WaveformPlayerControls} from 'frontend/PlayerControls';

import '@testing-library/jest-dom/extend-expect'
import {fireEvent} from '@testing-library/react'
import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'support';

describe('PlayerControls', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.player_controls.play': 'Play',
    'pageflow_scrolled.public.player_controls.text_tracks': 'Text Tracks'
  });

  [ClassicPlayerControls, WaveformPlayerControls].forEach((PlayerControlComponent)=>{
    it('supports onFocus prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = renderInEntry(<PlayerControlComponent onFocus={listener} />);

      getByLabelText('Play').focus();

      expect(listener).toHaveBeenCalled();
    });

    it('supports onBlur prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = renderInEntry(<PlayerControlComponent onBlur={listener} />);

      getByLabelText('Play').focus();
      getByLabelText('Play').blur();

      expect(listener).toHaveBeenCalled();
    });

    it('supports onMouseEnter prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = renderInEntry(<PlayerControlComponent onMouseEnter={listener} />);

      fireEvent.mouseEnter(getByLabelText('Play'));

      expect(listener).toHaveBeenCalled();
    });

    it('supports onMouseLeave prop', () => {
      const listener = jest.fn();
      const {getByLabelText} = renderInEntry(<PlayerControlComponent onMouseLeave={listener} />);

      fireEvent.mouseLeave(getByLabelText('Play'));

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
