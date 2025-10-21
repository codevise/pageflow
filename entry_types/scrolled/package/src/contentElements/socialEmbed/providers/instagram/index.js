import React from 'react';
import {InstagramPlaceholder} from './InstagramPlaceholder';
import {waitForIframeMessage} from '../../waitForIframeMessage';

export const instagramProvider = {
  name: 'instagram',
  Placeholder: InstagramPlaceholder,
  embedScript: 'https://www.instagram.com/embed.js',
  Seed: ({url}) => (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink={url}
      data-instgrm-version="14">
      <a href={url}>View this post on Instagram</a>
    </blockquote>
  ),
  process() {
    if (!window.instgrm?.Embeds) {
      return Promise.reject(new Error('Instagram embed script not loaded'));
    }

    window.instgrm.Embeds.process();
  },
  ready({element}) {
    return waitForIframeMessage(element);
  }
};
