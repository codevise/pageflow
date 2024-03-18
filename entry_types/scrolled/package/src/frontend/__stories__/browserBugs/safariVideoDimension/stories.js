import React from 'react';

import squareVideo from './100x100.mp4';
import landscapeVideo from './200x100.mp4';

export default {
  title: 'Frontend/Browser Bugs',
  parameters: {
    percy: {skip: true}
  }
}

export const safariVideoDimension = () => (
  <div>
    <style>
      {`
      .wr {width: 300px; height: 300px; }
      .wr > div,
      .video-js { height: 100%; }

      video {
        border: solid 1px red;
      }
      `}`
    </style>
    <p>
      Load video 1, release it, load  video 2. Observe the video being scaled
      down to only cover parts of the upper part of the video element.
    </p>
    <div className="wr" id="container"></div>
    <button onClick={() => loadVideo(0)}>Load video 1</button>
    <button onClick={() => loadVideo(1)}>Load video 2</button>
    <button onClick={() => release()}>Release</button>
  </div>
);

const srcs = [
  landscapeVideo,
  squareVideo
];

let video;

function loadVideo(i) {
  if (!video) {
    video = document.createElement('video');
    video.setAttribute('crossorigin', 'anonymous');
    video.setAttribute('playsinline', true);
    video.setAttribute('loop', true);
    video.setAttribute('class', 'video-js wr');
  }

  video.src = srcs[i];

  // Uncomment to fix
  // video.load();

  document.getElementById('container').appendChild(video);

  setTimeout(() => {
    video.play();
  }, 1000);
}

function release() {
  if (video) {
    video.pause();

    document.getElementById('container').removeChild(video);
  }
}
