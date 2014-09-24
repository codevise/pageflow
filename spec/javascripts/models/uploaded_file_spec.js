describe('UploadedFile', function() {
  var File = pageflow.UploadedFile.extend({
    readyState: 'ready'
  });

  var FilesCollection = Backbone.Collection.extend({
    model: File
  });

  describe('#destroyUsage', function() {
    before(function () {
      this.xhr = sinon.useFakeXMLHttpRequest();
      var requests = this.requests = [];

      this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    after(function () {
      this.xhr.restore();
    });

    it('deletes file usage via xhr', function() {
      var record = new File({id: 11, usage_id: 12});

      record.destroyUsage();

      expect(this.requests[0].url).to.equal('/editor/file_usages/12');
    });

    it('removes record from containing collection', function () {
      var record = new File({id: 11, usage_id: 12});
      var collection = new FilesCollection();
      collection.add(record);

      record.destroyUsage();

      expect(collection.contains(record)).not.to.be.ok;
    });
  });

  describe('#isReady', function() {
    it('returns true if state equals readyState', function() {
      var file = new File({state: 'ready'});

      expect(file.isReady()).to.eq(true);
    });
  });

  describe('#isFailed', function() {
    it('returns true if state ends with _failed', function() {
      var file = new File({state: 'upload_failed'});

      expect(file.isFailed()).to.eq(true);
    });

    it('returns false if state does not end with _failed', function() {
      var file = new File({state: 'uploading'});

      expect(file.isFailed()).to.eq(false);
    });
  });

  describe('#isPending', function() {
    it('returns true if neither ready nor failed ', function() {
      var file = new File({state: 'processing'});

      expect(file.isPending()).to.eq(true);
    });

    it('returns false if ready', function() {
      var file = new File({state: 'ready'});

      expect(file.isPending()).to.eq(false);
    });

    it('returns false if failed', function() {
      var file = new File({state: 'processing_failed'});

      expect(file.isPending()).to.eq(false);
    });
  });
});