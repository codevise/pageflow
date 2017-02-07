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

  describe('#displayLabel', function() {
    support.useFakeTranslations({
      'pageflow.languages.de': 'German',
      'pageflow.editor.text_track_files.label_missing': 'missing'
    });

    it('uses label configuration attribute', function() {
      var textTrackFile = new pageflow.TextTrackFile({
        configuration: {
          label: 'German'
        }
      });

      expect(textTrackFile.displayLabel()).to.eq('German');
    });

    it('falls back to inferred label', function() {
      var textTrackFile = new pageflow.TextTrackFile({
        configuration: {
          label: '',
          srclang: 'de'
        }
      });

      expect(textTrackFile.displayLabel()).to.eq('German');
    });

    it('falls back to placeholder', function() {
      var textTrackFile = new pageflow.TextTrackFile({
        configuration: {
          label: ''
        }
      });

      expect(textTrackFile.displayLabel()).to.eq('missing');
    });
  });

  describe('#inferredLabel', function() {
    it('returns label based on srclang', function() {
      var textTrackFile = new pageflow.TextTrackFile({
        configuration: {
          label: '',
          srclang: 'de'
        }
      });

      expect(textTrackFile.inferredLabel()).to.eq('German');
    });

    it('return null if srclang is blank', function() {
      var textTrackFile = new pageflow.TextTrackFile({
        configuration: {
          label: '',
          srclang: ''
        }
      });

      expect(textTrackFile.displayLabel()).to.be.falsy;
    });

    it('return null if srclang is unknown', function() {
      var textTrackFile = new pageflow.TextTrackFile({
        configuration: {
          label: '',
          srclang: 'unknown'
        }
      });

      expect(textTrackFile.displayLabel()).to.be.falsy;
    });
  });
});
