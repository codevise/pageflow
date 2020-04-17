import Backbone from 'backbone';
import Marionette from 'backbone-marionette';

import {
  modelLifecycleTrackingView,
  editor, delayedDestroying,
  failureTracking,
  Failure
} from 'pageflow/editor';

import * as support from '$support';

describe('modelLifecycleTrackingView', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  support.useFakeXhr(() => testContext);

  describe('creating class name', () => {
    it('is set when model is new', () => {
      const View = Marionette.View.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {creating: 'is-creating'}
        })]
      });

      const view = new View({model: new Backbone.Model()}).render();

      expect(view.$el).toHaveClass('is-creating');
    });

    it('is not set model has id', () => {
      const View = Marionette.View.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {creating: 'is-creating'}
        })]
      });

      const view = new View({model: new Backbone.Model({id: 5})}).render();

      expect(view.$el).not.toHaveClass('is-creating');
    });

    it('is removed when new model is saved', () => {
      const View = Marionette.View.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {creating: 'is-creating'}
        })]
      });

      const model = new Backbone.Model({}, {url: '/some'});
      const view = new View({model}).render();
      model.save();
      testContext.requests[0].respond(200,
                                      { 'Content-Type': 'application/json' },
                                      '{ "id": 12 }');

      expect(view.$el).not.toHaveClass('is-creating');
    });
  });

  describe('destroying class name', () => {
    it('is not set by default', () => {
      const View = Marionette.View.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {destroying: 'is-destroying'}
        })]
      });
      const Model = Backbone.Model.extend({
        mixins: [delayedDestroying]
      });

      const view = new View({model: new Model()}).render();

      expect(view.$el).not.toHaveClass('is-destroying');
    });

    it('is set when model is already being destroying', () => {
      const View = Marionette.View.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {destroying: 'is-destroying'}
        })]
      });
      const Model = Backbone.Model.extend({
        mixins: [delayedDestroying],
        url: '/some'
      });

      const model = new Model({id: 5});
      model.destroyWithDelay();
      const view = new View({model}).render();

      expect(view.$el).toHaveClass('is-destroying');
    });

    it('is set when model is destroyed', () => {
      const View = Marionette.View.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {destroying: 'is-destroying'}
        })]
      });
      const Model = Backbone.Model.extend({
        mixins: [delayedDestroying],
        url: '/some'
      });

      const model = new Model({id: 5});
      const view = new View({model}).render();
      model.destroyWithDelay();

      expect(view.$el).toHaveClass('is-destroying');
    });

    it('is removed when destroy request fails', () => {
      const View = Marionette.View.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {destroying: 'is-destroying'}
        })]
      });
      const Model = Backbone.Model.extend({
        mixins: [delayedDestroying],
        url: '/some'
      });

      const model = new Model({id: 5});
      const view = new View({model}).render();
      model.destroyWithDelay();
      testContext.requests[0].respond(404,
                                      { 'Content-Type': 'application/json' },
                                      '{}');

      expect(view.$el).not.toHaveClass('is-destroying');
    });
  });

  describe('failed class name', () => {
    it('is not set by default', () => {
      const View = Marionette.View.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {failed: 'is-failed'}
        })]
      });
      const Model = Backbone.Model.extend({
        mixins: [failureTracking],
        url: '/some'
      });

      const model = new Model({});
      const view = new View({model}).render();

      expect(view.$el).not.toHaveClass('is-failed');
    });

    it('is set when model is already failed', () => {
      const View = Marionette.View.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {failed: 'is-failed'}
        })]
      });
      const Model = Backbone.Model.extend({
        mixins: [failureTracking],
        url: '/some'
      });

      const model = new Model({});
      model.save();
      testContext.requests[0].respond(404,
                                      { 'Content-Type': 'application/json' },
                                      '{}');
      const view = new View({model}).render();

      expect(view.$el).toHaveClass('is-failed');
    });

    it('is set when failed state changes', () => {
      const View = Marionette.View.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {failed: 'is-failed'}
        })]
      });
      const Model = Backbone.Model.extend({
        mixins: [failureTracking],
        url: '/some'
      });

      const model = new Model({});
      const view = new View({model}).render();
      model.save();
      testContext.requests[0].respond(404,
                                      { 'Content-Type': 'application/json' },
                                      '{}');

      expect(view.$el).toHaveClass('is-failed');
    });
  });

  describe('failed message', () => {
    it('is updated from model failure messsage', () => {
      const View = Marionette.ItemView.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {failureMessage: 'message'}
        })],

        template: () => '<div class="message"></div>'
      });
      const Model = Backbone.Model.extend({
        isFailed() { return true; },

        getFailureMessage() { return 'Something went wrong'; }
      });

      const model = new Model({});
      const view = new View({model}).render();

      expect(view.$el).toHaveText('Something went wrong');
    });
  });

  describe('retry button', () => {
    it('retries failures', () => {
      const View = Marionette.ItemView.extend({
        mixins: [modelLifecycleTrackingView({
          classNames: {retryButton: 'retry-button'}
        })],

        template: () => '<button class="retry-button">sdfsdf</button>'
      });
      const failure = new (Failure.extend({retryAction: jest.fn()}))({
        model: new Backbone.Model({id: 5})
      });
      editor.failures.add(failure);

      const view = new View({model: new Backbone.Model()}).render();
      view.$el.find('.retry-button').trigger('click');

      expect(failure.retryAction).toHaveBeenCalled();
    });
  });
});
