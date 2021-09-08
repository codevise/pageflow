import Backbone from 'backbone';

import '@testing-library/jest-dom/extend-expect';

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

  it('triggers single model change event if invalid', () => {
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

  it('should be invalid if not a URL', () => {
    var model = new Backbone.Model();
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['example.com']
    });

    view.render();
    var input = view.$el.find('input');
    input.val('not-a-url');
    input.trigger('change');

    expect(input[0]).toBeInvalid();
  });

  it('should be invalid if URL has unsupported host', () => {
    var model = new Backbone.Model();
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['example.com']
    });

    view.render();
    var input = view.$el.find('input');
    input.val('http://other.com');
    input.trigger('change');

    expect(input[0]).toBeInvalid();
  });

  it('should be valid if URL with supported host', () => {
    var model = new Backbone.Model();
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['example.com']
    });

    view.render();
    var input = view.$el.find('input');
    input.val('http://example.com/foo');
    input.trigger('change');

    expect(input[0]).toBeValid();
  });

  it('should ignore http protocol in supported hosts', () => {
    var model = new Backbone.Model();
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

    expect(input[0]).toBeValid();
  });

  it('should ignore https protocol in supported hosts', () => {
    var model = new Backbone.Model();
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      permitHttps: true,
      supportedHosts: ['https://example.com']
    });

    view.render();
    var input = view.$el.find('input');
    input.val('https://example.com');
    input.trigger('change');

    expect(input[0]).toBeValid();
  });

  it('should be invalid if URL uses https', () => {
    var model = new Backbone.Model();
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      supportedHosts: ['example.com']
    });

    view.render();
    var input = view.$el.find('input');
    input.val('https://example.com');
    input.trigger('change');

    expect(input[0]).toBeInvalid();
  });

  it('should be valid if https is permitted and URL uses https', () => {
    var model = new Backbone.Model();
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      permitHttps: true,
      supportedHosts: ['example.com']
    });

    view.render();
    var input = view.$el.find('input');
    input.val('https://example.com');
    input.trigger('change');

    expect(input[0]).toBeValid();
  });

  it('should ignore protocol of supported Hosts if https permitted', () => {
    var model = new Backbone.Model();
    var view = new UrlInputView({
      model: model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      permitHttps: true,
      supportedHosts: ['http://example.com']
    });

    view.render();
    var input = view.$el.find('input');
    input.val('https://example.com');
    input.trigger('change');

    expect(input[0]).toBeValid();
  });
});
