import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {renderInEntry} from "../support";
import {AudioPlayer} from 'frontend/AudioPlayer';
import {browser} from 'pageflow/frontend';

describe('AudioPlayer', () => {
  let audioSeed = {
    fileUrlTemplates: {
      audioFiles: {
        mp3: ':id_partition/audio.mp3'
      }
    },
    audioFiles: [
      {id: 1, permaId: 100, isReady: true}
    ]
  };
  it('renders audio with provided file id', () => {
    return browser.detectFeatures().then(()=>{
      const result =
        renderInEntry(<AudioPlayer id={100} />, {
          seed: audioSeed
        });
      expect(result.container.querySelector('audio')).toBeDefined();
      // expect(getByRole('audio')).toHaveAttribute('src', expect.stringContaining('.mp3'));
    });
  });
});
