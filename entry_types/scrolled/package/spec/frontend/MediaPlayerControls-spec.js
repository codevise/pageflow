import {MediaPlayerControls} from 'frontend/MediaPlayerControls';
import {useFile} from 'entryState';

import React from 'react';

import {fireEvent} from '@testing-library/react';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'support';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';
import '@testing-library/jest-dom/extend-expect';

describe('MediaPlayerControls', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.languages.fr': 'French',
    'pageflow_scrolled.public.text_track_modes.none': 'Off',
    'pageflow_scrolled.public.text_track_modes.auto_off': 'Auto'
  });

  const seed = {
    audioFiles: [{
      id: 100,
      permaId: 10
    }],
    textTrackFiles: [{
      parentFileId: 100,
      parentFileModelType: 'Pageflow::AudioFile',
      configuration: {
        kind: 'subtitles',
        srclang: 'fr',
        label: 'French'
      }
    }]
  };

  it('checks auto text track menu item by default', () => {
    const {getByRole} = renderInEntry(
      () => <MediaPlayerControls file={useFile({collectionName: 'audioFiles', permaId: 10})}
                                 playerState={getInitialPlayerState()}
                                 playerActions={getPlayerActions()} />,
      {seed}
    );

    expect(getByRole('menuitemradio', {name: 'Auto'})).toHaveAttribute('aria-checked', 'true');
  });

  it('supports activating text tracks', () => {
    const {getByRole} = renderInEntry(
      () => <MediaPlayerControls file={useFile({collectionName: 'audioFiles', permaId: 10})}
                                 playerState={getInitialPlayerState()}
                                 playerActions={getPlayerActions()} />,
      {seed}
    );

    fireEvent.click(getByRole('menuitemradio', {name: 'French'}));

    expect(getByRole('menuitemradio', {name: 'French'})).toHaveAttribute('aria-checked', 'true');
  });

  it('supports turning text tracks off', () => {
    const {getByRole} = renderInEntry(
      () => <MediaPlayerControls file={useFile({collectionName: 'audioFiles', permaId: 10})}
                                 playerState={getInitialPlayerState()}
                                 playerActions={getPlayerActions()} />,
      {seed}
    );

    fireEvent.click(getByRole('menuitemradio', {name: 'Off'}));

    expect(getByRole('menuitemradio', {name: 'Off'})).toHaveAttribute('aria-checked', 'true');
  });

  it('supports activating auto text tracks again', () => {
    const {getByRole} = renderInEntry(
      () => <MediaPlayerControls file={useFile({collectionName: 'audioFiles', permaId: 10})}
                                 playerState={getInitialPlayerState()}
                                 playerActions={getPlayerActions()} />,
      {seed}
    );

    fireEvent.click(getByRole('menuitemradio', {name: 'Off'}));
    fireEvent.click(getByRole('menuitemradio', {name: 'Auto'}));

    expect(getByRole('menuitemradio', {name: 'Auto'})).toHaveAttribute('aria-checked', 'true');
  });
});
