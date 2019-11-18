import {TextTrackFile} from '$pageflow/editor';

import * as support from '$support';

describe('TextTrackFile', () => {
  describe('#extractLanguageCodeFromFilename', () => {
    test(
      'returns null if filename does not follow facebook convention',
      () => {
        var textTrackFile = new TextTrackFile(
          {
            file_name: 'does_not_follow_convention.en.vtt'
          });

        expect(textTrackFile.extractLanguageCodeFromFilename()).toBeNull();
      }
    );

    test(
      'returns the language code if filename does follow facebook convention',
      () => {
        var textTrackFile = new TextTrackFile(
          {
            file_name: 'does_follow_convention.en_EN.vtt'
          });

        expect(textTrackFile.extractLanguageCodeFromFilename()).toBe('en');
      }
    );
  });

  describe('#displayLabel', () => {
    support.useFakeTranslations({
      'pageflow.languages.de': 'German',
      'pageflow.editor.text_track_files.label_missing': 'missing'
    });

    test('uses label configuration attribute', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: 'German'
        }
      });

      expect(textTrackFile.displayLabel()).toBe('German');
    });

    test('falls back to inferred label', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: '',
          srclang: 'de'
        }
      });

      expect(textTrackFile.displayLabel()).toBe('German');
    });

    test('falls back to placeholder', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: ''
        }
      });

      expect(textTrackFile.displayLabel()).toBe('missing');
    });
  });

  describe('#inferredLabel', () => {
    test('returns label based on srclang', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: '',
          srclang: 'de'
        }
      });

      expect(textTrackFile.inferredLabel()).toBe('German');
    });

    test('return null if srclang is blank', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: '',
          srclang: ''
        }
      });

      expect(textTrackFile.displayLabel()).to.be.falsy;
    });

    test('return null if srclang is unknown', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: '',
          srclang: 'unknown'
        }
      });

      expect(textTrackFile.displayLabel()).to.be.falsy;
    });
  });
});
