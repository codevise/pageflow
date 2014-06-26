describe('filesCountWatcher', function() {
  var Model = Backbone.Model.extend({
    mixins: [pageflow.transientReferences]
  });

  describe('#setReference', function() {
    it('returns unsaved record', function() {
      var record = new Model(),
          imageFile = new pageflow.ImageFile();

      record.setReference('image_file_id', imageFile);

      expect(record.getReference('image_file_id')).to.equal(imageFile);
    });

    it('resets attribute while record is unsaved', function() {
      var record = new Model({image_file_id: 3}),
          imageFile = new pageflow.ImageFile();

      record.setReference('image_file_id', imageFile);

      expect(record.get('image_file_id')).to.equal(null);
    });

    it('sets record id once it is saved', function() {
      var record = new Model(),
          imageFile = new pageflow.ImageFile();

      record.setReference('image_file_id', imageFile);
      imageFile.set('id', 5);

      expect(record.get('image_file_id')).to.equal(5);
    });

    it('does not set record id if reference updated before save', function() {
      var record = new Model(),
          imageFile = new pageflow.ImageFile(),
          otherFile = new pageflow.ImageFile({id: 7});

      record.setReference('image_file_id', imageFile);
      record.setReference('image_file_id', otherFile);
      imageFile.set('id', 5);

      expect(record.get('image_file_id')).to.equal(7);
    });

    it('triggers change event once the file is ready', function() {
      var record = new Model(),
          imageFile = new pageflow.ImageFile(),
          changeListener = sinon.spy();

      record.setReference('image_file_id', imageFile);
      record.on('change', changeListener);
      imageFile.set('state', 'processed');

      expect(changeListener.called).to.be.ok;
    });

    it('does not trigger change event if reference was updated before ready', function() {
      var record = new Model(),
          imageFile = new pageflow.ImageFile(),
          otherFile = new pageflow.ImageFile({id: 7}),
          changeListener = sinon.spy();

      record.setReference('image_file_id', imageFile);
      record.setReference('image_file_id', otherFile);
      record.on('change', changeListener);
      imageFile.set('state', 'processed');

      expect(changeListener.called).to.equal(false);
    });
  });
});
