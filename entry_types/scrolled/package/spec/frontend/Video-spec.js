import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {Video} from 'frontend/Video';
import {renderInEntry} from "../support";

describe('Video', () => {
  it('renders', () => {
    const {getByRole} =
      renderInEntry(<Video id={100} />, {
        seed: {
          fileUrlTemplates: {
            videoFiles: {
              high: ':id_partition/video.mp4'
            }
          },
          videoFiles: [
            {id: 1, permaId: 100, isReady: true}
          ]
        }
      });

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('.mp4'));
  });
});
