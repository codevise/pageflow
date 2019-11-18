import Backbone from 'backbone';

import {EditorApi} from '$pageflow/editor';
import {Failure} from '$pageflow/editor/api/Failure';

describe('Failures API', () => {
  describe('#add', () => {
    it('accepts multiple failure objects', () => {
      var editor = new EditorApi(),
          modelA = new Backbone.Model(),
          modelB = new Backbone.Model();

      editor.failures.add(new Failure(modelA));
      expect(editor.failures.count()).toBe(1);
      expect(editor.failures.isEmpty()).toBe(false);

      editor.failures.add(new Failure(modelB));
      expect(editor.failures.count()).toBe(2);
    });

    it('overwrites failure objects of the same type and model', () => {
      var editor = new EditorApi(),
          modelA = new Backbone.Model();

      editor.failures.add(new Failure(modelA));
      expect(editor.failures.count()).toBe(1);
      editor.failures.add(new Failure(modelA));

      expect(editor.failures.count()).toBe(1);
    });
  });

  describe('#remove', () => {
    it('removes a failure by key', () => {
      var editor = new EditorApi(),
          failureA = new Failure(new Backbone.Model()),
          failureB = new Failure(new Backbone.Model());

      editor.failures.add(failureA);
      editor.failures.add(failureB);
      expect(editor.failures.count()).toBe(2);
      editor.failures.remove(failureA.key());

      expect(editor.failures.count()).toBe(1);
    });
  });

  describe('#watch', () => {
    it('adds failures when watched collection emits error', () => {
      var editor = new EditorApi(),
          collection = new Backbone.Collection();

      editor.failures.watch(collection);
      collection.trigger('error', new Backbone.Model().set('id', 1));

      expect(editor.failures.count()).toBe(1);
    });

    it('does not add failures for unsaved models', () => {
      var editor = new EditorApi(),
          collection = new Backbone.Collection();

      editor.failures.watch(collection);
      collection.trigger('error', new Backbone.Model());

      expect(editor.failures.count()).toBe(0);
    });
  });

  describe('#retry', () => {
    it('calls retry on failures', done => {
      var editor = new EditorApi(),
          collection = new Backbone.Collection(),
          SomeFailure = Failure.extend({
            retryAction: function() {
              done();
            }
          });

      editor.failures.add(new SomeFailure(new Backbone.Model()));

      editor.failures.retry();
    });
  });
});
