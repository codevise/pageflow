describe('file', function() {
  var File = Backbone.Model.extend({
    mixins: [pageflow.file]
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

});