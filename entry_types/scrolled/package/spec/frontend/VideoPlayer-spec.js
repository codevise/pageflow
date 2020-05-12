import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {renderInEntry} from "../support";
import {VideoPlayer} from 'frontend/VideoPlayer';
import {browser} from 'pageflow/frontend';

describe('AudioPlayer', () => {
  let videoSeed = {
    fileUrlTemplates: {
      audioFiles: {
        mp4: ':id_partition/video.mp4'
      }
    },
    audioFiles: [
      {id: 1, permaId: 100, isReady: true}
    ]
  };
  it('renders audio with provided file id', () => {
    return browser.detectFeatures().then(()=>{
      const result =
        renderInEntry(<VideoPlayer id={100} />, {
          seed: videoSeed
        });
      expect(result.container.querySelector('audio')).toBeDefined();
      // expect(getByRole('audio')).toHaveAttribute('src', expect.stringContaining('.mp3'));
    });
  });
});
