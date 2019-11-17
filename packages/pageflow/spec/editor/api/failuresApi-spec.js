describe('Failures API', function() {
  describe('#add', function() {
    it('accepts multiple failure objects', function() {
      var editor = new pageflow.EditorApi(),
          modelA = new Backbone.Model(),
          modelB = new Backbone.Model();

      editor.failures.add(new pageflow.Failure(modelA));
      expect(editor.failures.count()).to.equal(1);
      expect(editor.failures.isEmpty()).to.eq(false);

      editor.failures.add(new pageflow.Failure(modelB));
      expect(editor.failures.count()).to.equal(2);
    });

    it('overwrites failure objects of the same type and model', function () {
      var editor = new pageflow.EditorApi(),
          modelA = new Backbone.Model();

      editor.failures.add(new pageflow.Failure(modelA));
      expect(editor.failures.count()).to.equal(1);
      editor.failures.add(new pageflow.Failure(modelA));

      expect(editor.failures.count()).to.equal(1);
    });
  });

  describe('#remove', function() {
    it('removes a failure by key', function() {
      var editor = new pageflow.EditorApi(),
          failureA = new pageflow.Failure(new Backbone.Model()),
          failureB = new pageflow.Failure(new Backbone.Model());

      editor.failures.add(failureA);
      editor.failures.add(failureB);
      expect(editor.failures.count()).to.equal(2);
      editor.failures.remove(failureA.key());

      expect(editor.failures.count()).to.equal(1);
    });
  });

  describe('#watch', function() {
    it('adds failures when watched collection emits error', function() {
      var editor = new pageflow.EditorApi(),
          collection = new Backbone.Collection();

      editor.failures.watch(collection);
      collection.trigger('error', new Backbone.Model().set('id', 1));

      expect(editor.failures.count()).to.equal(1);
    });

    it('does not add failures for unsaved models', function() {
      var editor = new pageflow.EditorApi(),
          collection = new Backbone.Collection();

      editor.failures.watch(collection);
      collection.trigger('error', new Backbone.Model());

      expect(editor.failures.count()).to.equal(0);
    });
  });

  describe('#retry', function() {
    it('calls retry on failures', function(done) {
      var editor = new pageflow.EditorApi(),
          collection = new Backbone.Collection(),
          Failure = pageflow.Failure.extend({
            retryAction: function() {
              done();
            }
          });

      editor.failures.add(new Failure(new Backbone.Model()));

      editor.failures.retry();
    });
  });
});
