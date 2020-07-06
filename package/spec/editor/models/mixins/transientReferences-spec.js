import Backbone from 'backbone';

import {FilesCollection, ImageFile, transientReferences} from 'pageflow/editor';

import * as support from '$support';
import sinon from 'sinon';

describe('transientReferences', () => {
  var Model = Backbone.Model.extend({
    mixins: [transientReferences]
  });

  describe('#setReference', () => {
    it('returns unsaved record', () => {
      var record = new Model(),
          imageFile = new ImageFile();

      record.setReference('image_file_id', imageFile);

      expect(record.getReference('image_file_id')).toBe(imageFile);
    });

    it('resets attribute while record is unsaved', () => {
      var record = new Model({image_file_id: 3}),
          imageFile = new ImageFile();

      record.setReference('image_file_id', imageFile);

      expect(record.get('image_file_id')).toBeNull();
    });

    it('sets records perma_id once it is saved', () => {
      var record = new Model(),
          imageFile = new ImageFile();

      record.setReference('image_file_id', imageFile);
      imageFile.set({id: 1, perma_id: 5});

      expect(record.get('image_file_id')).toBe(5);
    });

    it('sets records perma_id if present', () => {
      var record = new Model(),
          imageFile = new ImageFile({id: 1, perma_id: 7});

      record.setReference('image_file_id', imageFile);

      expect(record.get('image_file_id')).toBe(7);
    });

    it(
      'does not set records perma_id if reference updated before save',
      () => {
        var record = new Model(),
            imageFile = new ImageFile(),
            otherFile = new ImageFile({id: 1, perma_id: 7});

        record.setReference('image_file_id', imageFile);
        record.setReference('image_file_id', otherFile);
        imageFile.set({id: 2, perma_id: 5});

        expect(record.get('image_file_id')).toBe(7);
      }
    );

    it('triggers change event once the file is ready', () => {
      const record = new Model();
      const imageFile = new ImageFile();
      const changeListener = sinon.spy();
      const options = {someOption: true};

      record.setReference('image_file_id', imageFile);
      record.on('change', changeListener);
      imageFile.set('state', 'processed', options);

      expect(changeListener).toHaveBeenCalledWith(record, options);
    });

    it(
      'triggers change:<attribute>:ready event once the file is ready',
      () => {
        var record = new Model(),
            imageFile = new ImageFile(),
            changeListener = sinon.spy();

        record.setReference('image_file_id', imageFile);
        record.on('change:image_file_id:ready', changeListener);
        imageFile.set('state', 'processed');

        expect(changeListener.called).toBeTruthy();
      }
    );

    it(
      'does not trigger change event if reference was updated before ready',
      () => {
        var record = new Model(),
            imageFile = new ImageFile(),
            otherFile = new ImageFile({perma_id: 7}),
            changeListener = sinon.spy();

        record.setReference('image_file_id', imageFile);
        record.setReference('image_file_id', otherFile);
        record.on('change', changeListener);
        imageFile.set('state', 'processed');

        expect(changeListener.called).toBe(false);
      }
    );

    it(
      'when change event triggers record can already be looked up in collection',
      () => {
        var record = new Model(),
            imageFiles = FilesCollection.createForFileType(
              support.factories.imageFileType(), []
            ),
            imageFile = new ImageFile(),
            imageFileFromCollection;

        imageFiles.add(imageFile);
        record.setReference('image_file_id', imageFile);
        record.on('change', function() {
          imageFileFromCollection = imageFiles.getByPermaId(5);
        });
        imageFile.set('perma_id', 5);

        expect(imageFileFromCollection).toBe(imageFile);
      }
    );
  });
});
