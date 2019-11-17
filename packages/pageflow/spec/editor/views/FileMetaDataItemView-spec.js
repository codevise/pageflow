describe('FileMetaDataItemView', () => {
  describe('#labelText', () => {
    support.useFakeTranslations({
      'pageflow.editor.files.attributes.image_files.alt.label': 'Image alt text',
      'pageflow.editor.files.common_attributes.text_tracks.label': 'Text tracks',
      'activerecord.attributes.pageflow/image_files.rights': 'Rights'
    });

    test('uses file type specific translatons', () => {
      var view = new pageflow.FileMetaDataItemView({
        model: support.factories.imageFile(),
        name: 'alt'
      });

      var result = view.labelText();

      expect(result).toBe('Image alt text');
    });

    test('falls back to common file translation', () => {
      var view = new pageflow.FileMetaDataItemView({
        model: support.factories.imageFile(),
        name: 'text_tracks'
      });

      var result = view.labelText();

      expect(result).toBe('Text tracks');
    });

    test('falls back to legacy translation', () => {
      var view = new pageflow.FileMetaDataItemView({
        model: support.factories.imageFile(),
        name: 'rights'
      });

      var result = view.labelText();

      expect(result).toBe('Rights');
    });
  });
});