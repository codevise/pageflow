import createFilePlayer from './createFilePlayer';

export default createFilePlayer({
  tagName: 'audio',

  sources: audioFile => [
    {type: 'audio/ogg', src: `${audioFile.urls.ogg}?u=1`},
    {type: 'audio/mp4', src: `${audioFile.urls.m4a}?u=1`},
    {type: 'audio/mp3', src: `${audioFile.urls.mp3}?u=1`}
  ],

  emulateTextTracksDisplay: true
});
