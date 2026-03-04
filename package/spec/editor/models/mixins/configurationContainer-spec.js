import Backbone from 'backbone';
import {configurationContainer, delayedDestroying} from 'pageflow/editor';

import * as support from '$support';

describe('configurationContainer', () => {
  let testContext;

  beforeEach(() => testContext = {});

  support.useFakeXhr(() => testContext);

  it('initializes configuration model from configuration attribute', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer()],
    });
    const model = new Model({configuration: {some: 'value'}});

    expect(model.configuration.get('some')).toBe('value');
  });

  it('supports using custom configuration model', () => {
    const Custom = Backbone.Model.extend({});
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer({configurationModel: Custom})],
    });
    const model = new Model({configuration: {some: 'value'}});

    expect(model.configuration).toBeInstanceOf(Custom);
  });

  it('makes routable id of confguration equal model', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer()],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}});

    expect(model.configuration.getRoutableId()).toBe(5);
  });

  it('invokes afterInitialize callback with model context', () => {
    const afterInitialize = jest.fn(function() {
      this.some = this.configuration.get('some');
    });
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer({afterInitialize})],
    });

    const model = new Model({configuration: {some: 'value'}});

    expect(afterInitialize).toHaveBeenCalled();
    expect(model.some).toBe('value');
  });

  it('triggers change:configuration event when configuration changes', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer()],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}});
    const listener = jest.fn();

    model.on('change:configuration', listener);
    model.configuration.set('some', 'other value', {customOption: true});

    expect(listener).toHaveBeenCalledWith(model, undefined, {customOption: true});
  });

  it('triggers change:configuration:<attribute> event when configuration changes', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer()],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}});
    const listener = jest.fn();

    model.on('change:configuration:some', listener);
    model.configuration.set('some', 'other value');

    expect(listener).toHaveBeenCalledWith(model, 'other value');
  });

  it('does not auto save by default', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer()],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}});
    model.save = jest.fn();

    model.configuration.set('some', 'other value');

    expect(model.save).not.toHaveBeenCalled();
  });

  it('supports auto saving', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer({autoSave: true})],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}});
    model.save = jest.fn();

    model.configuration.set('some', 'other value');

    expect(model.save).toHaveBeenCalled();
  });

  it('debounces auto save for rapid changes', () => {
    jest.useFakeTimers();
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer({autoSave: true})],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}});
    model.save = jest.fn();

    model.configuration.set('some', 'a');
    model.configuration.set('some', 'b');
    model.configuration.set('some', 'c');

    expect(model.save).toHaveBeenCalledTimes(1);

    jest.runAllTimers();

    expect(model.save).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });

  it('resets trailing save delay on each new change', () => {
    jest.useFakeTimers();
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer({autoSave: true})],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}});
    model.save = jest.fn();

    model.configuration.set('some', 'a');
    expect(model.save).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(300);
    model.configuration.set('some', 'b');

    jest.advanceTimersByTime(300);
    expect(model.save).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(200);
    expect(model.save).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });

  it('does not fire trailing save for single change', () => {
    jest.useFakeTimers();
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer({autoSave: true})],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}});
    model.save = jest.fn();

    model.configuration.set('some', 'other value');

    expect(model.save).toHaveBeenCalledTimes(1);

    jest.runAllTimers();

    expect(model.save).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('does not fire trailing save for destroyed model', () => {
    jest.useFakeTimers();
    const Model = Backbone.Model.extend({
      mixins: [
        configurationContainer({autoSave: true}),
        delayedDestroying
      ],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}}, {urlRoot: '/models'});
    model.save = jest.fn();

    model.configuration.set('some', 'a');
    model.configuration.set('some', 'b');

    expect(model.save).toHaveBeenCalledTimes(1);

    model.destroyWithDelay();
    testContext.requests[0].respond(204, { 'Content-Type': 'application/json' }, '');

    jest.runAllTimers();

    expect(model.save).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('does not auto save new model', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer({autoSave: true})],
    });
    const model = new Model({configuration: {some: 'value'}});
    model.save = jest.fn();

    model.configuration.set('some', 'other value');

    expect(model.save).not.toHaveBeenCalled();
  });

  it('supports suppressing auto save for single set call', () => {
    const Model = Backbone.Model.extend({
      mixins: [
        configurationContainer({autoSave: true})
      ],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}});
    model.save = jest.fn();

    model.configuration.set({some: 'other value'}, {autoSave: false});

    expect(model.save).not.toHaveBeenCalled();
  });


  it('does not auto save destroying model', () => {
    const Model = Backbone.Model.extend({
      mixins: [
        configurationContainer({autoSave: true}),
        delayedDestroying
      ],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}}, {urlRoot: '/models'});
    model.save = jest.fn();

    model.destroyWithDelay();
    model.configuration.set('some', 'other value');

    expect(model.save).not.toHaveBeenCalled();
  });

  it('does not auto save destroyed model', () => {
    const Model = Backbone.Model.extend({
      mixins: [
        configurationContainer({autoSave: true}),
        delayedDestroying
      ],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}}, {urlRoot: '/models'});
    model.save = jest.fn();

    model.destroyWithDelay();
    testContext.requests[0].respond(204, { 'Content-Type': 'application/json' }, '');
    model.configuration.set('some', 'other value');

    expect(model.save).not.toHaveBeenCalled();
  });

  it('auto saves model including delayedDestroying', () => {
    const Model = Backbone.Model.extend({
      mixins: [
        configurationContainer({autoSave: true}),
        delayedDestroying
      ],
    });
    const model = new Model({id: 5, configuration: {some: 'value'}}, {urlRoot: '/models'});
    model.save = jest.fn();

    model.configuration.set('some', 'other value');

    expect(model.save).toHaveBeenCalled();
  });

  it('includes configuration in data returned by toJSON', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer()],
    });
    const model = new Model({configuration: {some: 'value'}});

    model.configuration.set('some', 'other value');

    expect(model.toJSON()).toMatchObject({configuration: {some: 'other value'}});
  });

  it('supports including all attributes in data returned by toJSON', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer({includeAttributesInJSON: true})],
    });
    const model = new Model({title: 'Title', configuration: {some: 'value'}});

    model.configuration.set('some', 'other value');

    expect(model.toJSON()).toMatchObject({
      title: 'Title',
      configuration: {some: 'other value'}
    });
  });

  it('supports including specific attributes in data returned by toJSON', () => {
    const Model = Backbone.Model.extend({
      mixins: [configurationContainer({includeAttributesInJSON: ['title']})],
    });
    const model = new Model({title: 'Title', other: 'attribute', configuration: {some: 'value'}});

    model.configuration.set('some', 'other value');

    expect(model.toJSON()).toMatchObject({
      title: 'Title',
      configuration: {some: 'other value'}
    });
    expect(model.toJSON()).not.toMatchObject({
      other: 'attribute'
    });
  });
});
