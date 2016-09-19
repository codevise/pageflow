describe('TextTrackFile', function() {
  describe('#extractLanguageCodeFromFilename', function() {
    it('returns null if filename does not follow facebook convention', function() {
      var textTrackFile = new pageflow.TextTrackFile(
        {
          file_name: 'does_not_follow_convention.en.vtt'
        });

      expect(textTrackFile.extractLanguageCodeFromFilename()).to.equal(null);
    });

    it('returns the language code if filename does follow facebook convention', function() {
      var textTrackFile = new pageflow.TextTrackFile(
        {
          file_name: 'does_follow_convention.en_EN.vtt'
        });

      expect(textTrackFile.extractLanguageCodeFromFilename()).to.equal('en');
    });
  });
});
