import {TextTrackFile} from '$pageflow/editor';

import * as support from '$support';

describe('TextTrackFile', () => {
  describe('#extractLanguageCodeFromFilename', () => {
    it(
      'returns null if filename does not follow facebook convention',
      () => {
        var textTrackFile = new TextTrackFile(
          {
            file_name: 'does_not_follow_convention.en.vtt'
          });

        expect(textTrackFile.extractLanguageCodeFromFilename()).toBeNull();
      }
    );

    it(
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

    it('uses label configuration attribute', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: 'German'
        }
      });

      expect(textTrackFile.displayLabel()).toBe('German');
    });

    it('falls back to inferred label', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: '',
          srclang: 'de'
        }
      });

      expect(textTrackFile.displayLabel()).toBe('German');
    });

    it('falls back to placeholder', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: ''
        }
      });

      expect(textTrackFile.displayLabel()).toBe('missing');
    });
  });

  describe('#inferredLabel', () => {
    support.useFakeTranslations({
      'pageflow.languages.de': 'German'
    });

    it('returns label based on srclang', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: '',
          srclang: 'de'
        }
      });

      expect(textTrackFile.inferredLabel()).toBe('German');
    });

    it('return undefined if srclang is blank', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: '',
          srclang: ''
        }
      });

      expect(textTrackFile.inferredLabel()).toBe(undefined);
    });

    it('return empty string if srclang is unknown', () => {
      var textTrackFile = new TextTrackFile({
        configuration: {
          label: '',
          srclang: 'unknown'
        }
      });

      expect(textTrackFile.inferredLabel()).toBe('');
    });
  });
});
