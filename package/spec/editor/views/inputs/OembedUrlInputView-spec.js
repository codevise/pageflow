import Backbone from 'backbone';
import {fireEvent} from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

import {OembedUrlInputView} from 'editor';

import {useFakeTranslations, useFakeXhr, renderBackboneView} from '$support';

describe('OembedUrlInputView', () => {
  useFakeTranslations({
    'pageflow.editor.views.inputs.oembed_url_input_view.status.resolving': 'Resolving...',
    'pageflow.editor.views.inputs.oembed_url_input_view.status.invalid_provider': 'Invalid provider',
    'pageflow.editor.views.inputs.oembed_url_input_view.status.not_found': 'URL not found',
    'pageflow.editor.views.inputs.oembed_url_input_view.status.error': 'Error resolving URL',
    'pageflow.ui.views.inputs.url_input_view.url_hint': 'Enter a valid URL'
  });

  let testContext = {};

  useFakeXhr(() => testContext);

  it('renders input field', () => {
    const model = new Backbone.Model({url: '', provider: 'test_provider'});
    const view = new OembedUrlInputView({
      model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      providerNameProperty: 'provider'
    });

    const {getByRole} = renderBackboneView(view);
    const input = getByRole('textbox');

    expect(input).toBeInTheDocument();
  });

  it('loads display property from model', () => {
    const model = new Backbone.Model({
      url: 'https://example.com/post/123',
      displayUrl: 'https://example.com/post/123',
      provider: 'test_provider'
    });
    const view = new OembedUrlInputView({
      model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      providerNameProperty: 'provider'
    });

    const {getByRole} = renderBackboneView(view);
    const input = getByRole('textbox');

    expect(input).toHaveValue('https://example.com/post/123');
  });

  it('resolves URL via XHR on change', () => {
    const model = new Backbone.Model({
      url: '',
      provider: 'test_provider'
    });
    const view = new OembedUrlInputView({
      model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      providerNameProperty: 'provider'
    });

    const {getByRole} = renderBackboneView(view);
    const input = getByRole('textbox');

    input.value = 'https://example.com/post/123';
    fireEvent.change(input);

    expect(testContext.requests.length).toBe(1);
    expect(testContext.requests[0].url).toContain('/editor/oembed');
    expect(testContext.requests[0].url).toContain('provider=test_provider');
    expect(testContext.requests[0].url).toContain('url=https%3A%2F%2Fexample.com%2Fpost%2F123');
  });

  it('shows resolving status during request', () => {
    const model = new Backbone.Model({
      url: '',
      provider: 'test_provider'
    });
    const view = new OembedUrlInputView({
      model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      providerNameProperty: 'provider'
    });

    const {getByRole} = renderBackboneView(view);
    const input = getByRole('textbox');
    const validation = view.el.querySelector('.validation');

    input.value = 'https://example.com/post/123';
    fireEvent.change(input);

    expect(validation).toHaveTextContent('Resolving...');
    expect(validation).toHaveClass('pending');
  });

  it('transforms URL with provider-specific processing function', () => {
    const model = new Backbone.Model({
      url: '',
      provider: 'test_provider'
    });
    const processingFunction = jest.fn((response) => response.author_url);
    const view = new OembedUrlInputView({
      model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      providerNameProperty: 'provider',
      processingFunctions: {
        test_provider: processingFunction
      }
    });

    const {getByRole} = renderBackboneView(view);
    const input = getByRole('textbox');

    input.value = 'https://example.com/post/123';
    fireEvent.change(input);

    const response = {
      html: '<iframe src="..."></iframe>',
      title: 'Example Post',
      author_url: 'https://example.com/canonical/123'
    };
    testContext.server.respond(
      'GET', /\/editor\/oembed/,
      [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
    );

    expect(processingFunction).toHaveBeenCalledWith(response);
    expect(model.get('url')).toBe('https://example.com/canonical/123');
    expect(model.get('displayUrl')).toBe('https://example.com/post/123');
  });

  it('saves URL without transformation if no processing function', () => {
    const model = new Backbone.Model({
      url: '',
      provider: 'test_provider'
    });
    const view = new OembedUrlInputView({
      model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      providerNameProperty: 'provider'
    });

    const {getByRole} = renderBackboneView(view);
    const input = getByRole('textbox');
    const testUrl = 'https://example.com/post/123';

    input.value = testUrl;
    fireEvent.change(input);

    testContext.server.respond(
      'GET', /\/editor\/oembed/,
      [200, {'Content-Type': 'application/json'}, JSON.stringify({html: '<div></div>'})]
    );

    expect(model.get('url')).toBe(testUrl);
    expect(model.get('displayUrl')).toBe(testUrl);
  });

  it('shows invalid_provider error on 422 status', () => {
    const model = new Backbone.Model({
      url: '',
      provider: 'unknown_provider'
    });
    const view = new OembedUrlInputView({
      model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      providerNameProperty: 'provider'
    });

    const {getByRole} = renderBackboneView(view);
    const input = getByRole('textbox');
    const validation = view.el.querySelector('.validation');

    input.value = 'https://example.com/post/123';
    fireEvent.change(input);

    testContext.server.respond(
      'GET', /\/editor\/oembed/,
      [422, {'Content-Type': 'application/json'}, '']
    );

    expect(validation).toHaveTextContent('Invalid provider');
    expect(validation).toHaveClass('failed');
    expect(input).toBeInvalid();
  });

  it('shows not_found error on 404 status', () => {
    const model = new Backbone.Model({
      url: '',
      provider: 'test_provider'
    });
    const view = new OembedUrlInputView({
      model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      providerNameProperty: 'provider'
    });

    const {getByRole} = renderBackboneView(view);
    const input = getByRole('textbox');
    const validation = view.el.querySelector('.validation');

    input.value = 'https://example.com/post/invalid';
    fireEvent.change(input);

    testContext.server.respond(
      'GET', /\/editor\/oembed/,
      [404, {'Content-Type': 'application/json'}, '']
    );

    expect(validation).toHaveTextContent('URL not found');
    expect(validation).toHaveClass('failed');
    expect(input).toBeInvalid();
  });

  it('does not make request if URL is empty', () => {
    const model = new Backbone.Model({
      url: '',
      provider: 'test_provider'
    });
    const view = new OembedUrlInputView({
      model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      providerNameProperty: 'provider'
    });

    const {getByRole} = renderBackboneView(view);
    const input = getByRole('textbox');

    input.value = '';
    fireEvent.change(input);

    expect(testContext.requests.length).toBe(0);
  });

  it('does not make request if provider is not set', () => {
    const model = new Backbone.Model({
      url: '',
      provider: null
    });
    const view = new OembedUrlInputView({
      model,
      propertyName: 'url',
      displayPropertyName: 'displayUrl',
      providerNameProperty: 'provider'
    });

    const {getByRole} = renderBackboneView(view);
    const input = getByRole('textbox');

    input.value = 'https://example.com/post/123';
    fireEvent.change(input);

    expect(testContext.requests.length).toBe(0);
  });
});
