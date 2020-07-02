import React, {useRef} from 'react';
import {normalizeAndMergeFixture, filePermaId} from 'pageflow-scrolled/spec/support/stories';

import {RootProviders, useFile} from 'pageflow-scrolled/frontend';

export default {
  title: 'Frontend/Browser Bugs',
  parameters: {
    percy: {skip: true}
  }
}

export const chromeWebaudioCurrentTimeSegfault = () =>
  <RootProviders seed={normalizeAndMergeFixture({})}>
    <Test />
  </RootProviders>;

function Test() {
  const file = useFile({collectionName: 'audioFiles',permaId: filePermaId('audioFiles', 'quicktime_jingle')});
  const ref = useRef();
  const audioElement = useRef();

  function setup() {
    const audio = document.createElement('audio');
    
    audio.setAttribute('controls', true);
    audio.setAttribute('crossorigin', 'anonymous');

    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();

    var source = audioContext.createMediaElementSource(audio);
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    audioElement.current = audio;
    ref.current.appendChild(audioElement.current);
  }

  function* loop() {
    while (true) {
      unalloc();
      yield delay(200);
      alloc();
      yield delay(200);
      audioElement.current.play()
      yield delay(200);
    }
  }

  function alloc() {
    audioElement.current.currentTime = 0.171806;
    setTimeout(() => audioElement.current.setAttribute('src', file.urls.ogg), 1);
  }

  function unalloc() {
    const blank = 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBA' +
                  'AAAABAAEAIlYAAESsAAACABAAZGF0YRAAAAAAAAAAAAAAAAAAAAAAAA==';

    audioElement.current.setAttribute('src', blank);
  }

  return (
    <div>
      <p>
        Chrome 83 sometimes crashes with a SIGSEGV error when for
        an <code>audio</code> element which is connected to an <code>AudioContext</code>:
      </p>
      <ol>
        <li><code>src</code> is set to a blank audio file.</li>
        <li><code>currentTime</code> is set to a positive value.</li>
        <li><code>src</code> is updated to a longer audio file.</li>
      </ol>
      <p>
        In production code, this happens when an unallocated media element is reused since
        VideoJS updates sources with a timeout.
      </p>
      <button onClick={() => { setup(); run(loop()) }}>Reproduce</button>
      <div ref={ref} />
    </div>
  )
}

function delay(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

async function run(commands) {
  for (let c of commands) {
    await c;
  }
}

