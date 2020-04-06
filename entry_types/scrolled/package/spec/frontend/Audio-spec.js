import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {Audio} from 'frontend/Audio';
import {renderInEntry} from "../support";

describe('Audio', () => {
  it('renders', () => {
    const {getByRole} =
      renderInEntry(<Audio id={100} />, {
        seed: {
          fileUrlTemplates: {
            audioFiles: {
              mp3: ':id_partition/audio.mp3'
            }
          },
          audioFiles: [
            {id: 1, permaId: 100, isReady: true}
          ]
        }
      });

    expect(getByRole('audio')).toHaveAttribute('src', expect.stringContaining('.mp3'));
  });
});
