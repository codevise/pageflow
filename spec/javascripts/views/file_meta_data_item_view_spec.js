describe('FileMetaDataItemView', function() {
  describe('#labelText', function() {
    support.useFakeTranslations({
      'pageflow.editor.files.attributes.image_files.alt.label': 'Image alt text',
      'pageflow.editor.files.common_attributes.text_tracks.label': 'Text tracks',
      'activerecord.attributes.pageflow/image_files.rights': 'Rights'
    });

    it('uses file type specific translatons', function() {
      var view = new pageflow.FileMetaDataItemView({
        model: support.factories.imageFile(),
        name: 'alt'
      });

      var result = view.labelText();

      expect(result).to.eq('Image alt text');
    });

    it('falls back to common file translation', function() {
      var view = new pageflow.FileMetaDataItemView({
        model: support.factories.imageFile(),
        name: 'text_tracks'
      });

      var result = view.labelText();

      expect(result).to.eq('Text tracks');
    });

    it('falls back to legacy translation', function() {
      var view = new pageflow.FileMetaDataItemView({
        model: support.factories.imageFile(),
        name: 'rights'
      });

      var result = view.labelText();

      expect(result).to.eq('Rights');
    });
  });
});