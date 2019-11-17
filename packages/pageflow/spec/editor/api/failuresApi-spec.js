describe('Failures API', () => {
  describe('#add', () => {
    test('accepts multiple failure objects', () => {
      var editor = new pageflow.EditorApi(),
          modelA = new Backbone.Model(),
          modelB = new Backbone.Model();

      editor.failures.add(new pageflow.Failure(modelA));
      expect(editor.failures.count()).toBe(1);
      expect(editor.failures.isEmpty()).toBe(false);

      editor.failures.add(new pageflow.Failure(modelB));
      expect(editor.failures.count()).toBe(2);
    });

    test('overwrites failure objects of the same type and model', () => {
      var editor = new pageflow.EditorApi(),
          modelA = new Backbone.Model();

      editor.failures.add(new pageflow.Failure(modelA));
      expect(editor.failures.count()).toBe(1);
      editor.failures.add(new pageflow.Failure(modelA));

      expect(editor.failures.count()).toBe(1);
    });
  });

  describe('#remove', () => {
    test('removes a failure by key', () => {
      var editor = new pageflow.EditorApi(),
          failureA = new pageflow.Failure(new Backbone.Model()),
          failureB = new pageflow.Failure(new Backbone.Model());

      editor.failures.add(failureA);
      editor.failures.add(failureB);
      expect(editor.failures.count()).toBe(2);
      editor.failures.remove(failureA.key());

      expect(editor.failures.count()).toBe(1);
    });
  });

  describe('#watch', () => {
    test('adds failures when watched collection emits error', () => {
      var editor = new pageflow.EditorApi(),
          collection = new Backbone.Collection();

      editor.failures.watch(collection);
      collection.trigger('error', new Backbone.Model().set('id', 1));

      expect(editor.failures.count()).toBe(1);
    });

    test('does not add failures for unsaved models', () => {
      var editor = new pageflow.EditorApi(),
          collection = new Backbone.Collection();

      editor.failures.watch(collection);
      collection.trigger('error', new Backbone.Model());

      expect(editor.failures.count()).toBe(0);
    });
  });

  describe('#retry', () => {
    test('calls retry on failures', done => {
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
