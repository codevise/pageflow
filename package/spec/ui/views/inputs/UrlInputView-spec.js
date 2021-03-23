import Backbone from 'backbone';

import {UrlInputView} from 'pageflow/ui';

describe('UrlInputView', () => {
  it('loads display property', () => {
    var model = new Backbone.Model({
      url: 'http://example.com/some',
      displayUrl: 'http://example.com/some'
    });
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['http://example.com']
    });

    view.render();
    var input = view.$el.find('input');

    expect(input.val()).toEqual('http://example.com/some');
  });

  it('falls back to property if display property is missing', () => {
    var model = new Backbone.Model({
      url: 'http://example.com/some'
    });
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['http://example.com']
    });

    view.render();
    var input = view.$el.find('input');

    expect(input.val()).toEqual('http://example.com/some');
  });

  it('sets display property on change', () => {
    var model = new Backbone.Model({});
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['http://example.com']
    });

    view.render();
    var input = view.$el.find('input');
    input.val('http://example.com');
    input.trigger('change');

    expect(model.get('displayUrl')).toEqual('http://example.com');
  });

  it('sets display property on change even if invalid', () => {
    var model = new Backbone.Model({});
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['http://example.com']
    });

    view.render();
    var input = view.$el.find('input');
    input.val('http://not-supported.com');
    input.trigger('change');

    expect(model.get('displayUrl')).toEqual('http://not-supported.com');
  });

  it('sets property on change if valid', () => {
    var model = new Backbone.Model({});
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['http://example.com']
    });

    view.render();
    var input = view.$el.find('input');
    input.val('http://example.com');
    input.trigger('change');

    expect(model.get('url')).toEqual('http://example.com');
  });

  it('unsets property on change if invalid', () => {
    var model = new Backbone.Model({
      url: 'http://example.com/previous'
    });
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['http://example.com']
    });

    view.render();
    var input = view.$el.find('input');
    input.val('http://not-supported.com');
    input.trigger('change');

    expect(model.get('url')).toBe(undefined);
  });

  it('triggers single model change event if valid', () => {
    var model = new Backbone.Model({
      url: 'http://example.com/some',
      displayUrl: 'http://example.com/some'
    });
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['http://example.com']
    });
    var listener = jest.fn();

    model.on('change', listener);
    view.render();
    var input = view.$el.find('input');
    input.val('http://example.com/other');
    input.trigger('change');

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('triggers single model change event if valid', () => {
    var model = new Backbone.Model({
      url: 'http://example.com/some',
      displayUrl: 'http://example.com/some'
    });
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['http://example.com']
    });
    var listener = jest.fn();

    model.on('change', listener);
    view.render();
    var input = view.$el.find('input');
    input.val('http://not-supported.com/other');
    input.trigger('change');

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
