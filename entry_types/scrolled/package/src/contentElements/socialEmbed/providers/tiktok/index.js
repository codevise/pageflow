import React from 'react';
import {TiktokPlaceholder} from './TiktokPlaceholder';
import {waitForIframeMessage} from '../../waitForIframeMessage';

export const tiktokProvider = {
  name: 'tiktok',
  Placeholder: TiktokPlaceholder,
  embedScript: 'https://www.tiktok.com/embed.js',
  Seed: ({url}) => {
    const videoId = url ? url.split('/video/')[1]?.split('?')[0] : undefined;

    return (
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{width: '325px'}}>
        <section>
          <a target="_blank" rel="noopener noreferrer" href={url}>View on TikTok</a>
        </section>
      </blockquote>
    );
  },
  ready({element}) {
    return waitForIframeMessage(element);
  }
};
