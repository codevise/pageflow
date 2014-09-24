pageflow.AudioFile = pageflow.HostedFile.extend({
  mixins: [pageflow.encodedFile],

  thumbnailPictogram: 'audio',
});
