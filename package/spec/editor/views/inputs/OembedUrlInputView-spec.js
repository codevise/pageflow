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

  describe('provider switching', () => {
    it('clears URL when provider changes', () => {
      const model = new Backbone.Model({
        url: 'https://twitter.com/post/123',
        displayUrl: 'https://twitter.com/post/123',
        provider: 'twitter'
      });
      const view = new OembedUrlInputView({
        model,
        propertyName: 'url',
        displayPropertyName: 'displayUrl',
        providerNameProperty: 'provider'
      });

      renderBackboneView(view);

      model.set('provider', 'bluesky');

      expect(model.get('url')).toBe('');
      expect(model.get('displayUrl')).toBe('');
      expect(view.ui.input.val()).toBe('');
    });

    it('restores display URL when switching back to provider', () => {
      const model = new Backbone.Model({
        url: '',
        displayUrl: '',
        provider: 'twitter'
      });
      const view = new OembedUrlInputView({
        model,
        propertyName: 'url',
        displayPropertyName: 'displayUrl',
        providerNameProperty: 'provider'
      });

      const {getByRole} = renderBackboneView(view);
      const input = getByRole('textbox');

      // Enter Twitter URL
      input.value = 'https://twitter.com/post/123';
      fireEvent.change(input);
      testContext.server.respond(
        'GET', /\/editor\/oembed/,
        [200, {'Content-Type': 'application/json'}, JSON.stringify({html: '<div></div>'})]
      );

      // Switch to Bluesky
      model.set('provider', 'bluesky');

      // Enter Bluesky URL
      input.value = 'https://bsky.app/post/456';
      fireEvent.change(input);
      testContext.server.respond(
        'GET', /\/editor\/oembed/,
        [200, {'Content-Type': 'application/json'}, JSON.stringify({html: '<blockquote></blockquote>'})]
      );

      // Switch back to Twitter
      model.set('provider', 'twitter');

      // Verify Twitter URL is restored
      expect(view.ui.input.val()).toBe('https://twitter.com/post/123');
      expect(model.get('displayUrl')).toBe('https://twitter.com/post/123');
    });

    it('re-validates restored URL and sets properties', () => {
      const processingFunction = jest.fn((response) => response.author_url);
      const model = new Backbone.Model({
        url: '',
        displayUrl: '',
        provider: 'bluesky'
      });
      const view = new OembedUrlInputView({
        model,
        propertyName: 'url',
        displayPropertyName: 'displayUrl',
        providerNameProperty: 'provider',
        processingFunctions: {
          bluesky: processingFunction
        }
      });

      const {getByRole} = renderBackboneView(view);
      const input = getByRole('textbox');

      // Enter and validate Bluesky URL
      input.value = 'https://bsky.app/post/123';
      fireEvent.change(input);
      testContext.server.respond(
        'GET', /\/editor\/oembed/,
        [200, {'Content-Type': 'application/json'}, JSON.stringify({
          html: '<div></div>',
          author_url: 'at://did:plc:123/app.bsky.feed.post/456'
        })]
      );

      // Verify initial state
      expect(model.get('url')).toBe('at://did:plc:123/app.bsky.feed.post/456');
      expect(model.get('displayUrl')).toBe('https://bsky.app/post/123');

      const initialRequestCount = testContext.requests.length;

      // Switch to Twitter
      model.set('provider', 'twitter');

      // Verify properties are cleared
      expect(model.get('url')).toBe('');
      expect(model.get('displayUrl')).toBe('');

      // Switch back to Bluesky
      model.set('provider', 'bluesky');

      // Verify XHR request is made to re-validate
      expect(testContext.requests.length).toBeGreaterThan(initialRequestCount);
      expect(testContext.requests[testContext.requests.length - 1].url).toContain('/editor/oembed');
      expect(testContext.requests[testContext.requests.length - 1].url).toContain('provider=bluesky');

      // Respond to re-validation request
      testContext.server.respond(
        'GET', /\/editor\/oembed/,
        [200, {'Content-Type': 'application/json'}, JSON.stringify({
          html: '<div></div>',
          author_url: 'at://did:plc:123/app.bsky.feed.post/456'
        })]
      );

      // Verify both properties are set after re-validation
      expect(model.get('displayUrl')).toBe('https://bsky.app/post/123');
      expect(model.get('url')).toBe('at://did:plc:123/app.bsky.feed.post/456');
    });

    it('restores invalid URL with error state', () => {
      const model = new Backbone.Model({
        url: '',
        displayUrl: '',
        provider: 'twitter'
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

      // Enter invalid URL
      input.value = 'https://twitter.com/invalid';
      fireEvent.change(input);
      testContext.server.respond(
        'GET', /\/editor\/oembed/,
        [404, {'Content-Type': 'application/json'}, '']
      );

      // Verify error state
      expect(validation).toHaveTextContent('URL not found');

      // Switch to Bluesky
      model.set('provider', 'bluesky');

      // Switch back to Twitter
      model.set('provider', 'twitter');

      // Respond to re-validation
      testContext.server.respond(
        'GET', /\/editor\/oembed/,
        [404, {'Content-Type': 'application/json'}, '']
      );

      // Verify URL is restored and error is shown again
      expect(view.ui.input.val()).toBe('https://twitter.com/invalid');
      expect(validation).toHaveTextContent('URL not found');
      expect(input).toBeInvalid();
    });

    it('does not restore if no previous value exists', () => {
      const model = new Backbone.Model({
        url: '',
        displayUrl: '',
        provider: 'twitter'
      });
      const view = new OembedUrlInputView({
        model,
        propertyName: 'url',
        displayPropertyName: 'displayUrl',
        providerNameProperty: 'provider'
      });

      renderBackboneView(view);

      const initialRequestCount = testContext.requests.length;

      // Switch to Bluesky without entering URL
      model.set('provider', 'bluesky');

      // Verify fields remain empty and no XHR request is made
      expect(view.ui.input.val()).toBe('');
      expect(model.get('url')).toBe('');
      expect(model.get('displayUrl')).toBe('');
      expect(testContext.requests.length).toBe(initialRequestCount);
    });

    it('tracks multiple providers independently', () => {
      const model = new Backbone.Model({
        url: '',
        displayUrl: '',
        provider: 'twitter'
      });
      const view = new OembedUrlInputView({
        model,
        propertyName: 'url',
        displayPropertyName: 'displayUrl',
        providerNameProperty: 'provider'
      });

      const {getByRole} = renderBackboneView(view);
      const input = getByRole('textbox');

      // Set Twitter URL
      input.value = 'https://twitter.com/post/1';
      fireEvent.change(input);
      testContext.server.respond(
        'GET', /\/editor\/oembed/,
        [200, {'Content-Type': 'application/json'}, JSON.stringify({html: '<div></div>'})]
      );

      // Switch to Bluesky and set URL
      model.set('provider', 'bluesky');
      input.value = 'https://bsky.app/post/2';
      fireEvent.change(input);
      testContext.server.respond(
        'GET', /\/editor\/oembed/,
        [200, {'Content-Type': 'application/json'}, JSON.stringify({html: '<blockquote></blockquote>'})]
      );

      // Switch to Instagram and set URL
      model.set('provider', 'instagram');
      input.value = 'https://instagram.com/p/3';
      fireEvent.change(input);
      testContext.server.respond(
        'GET', /\/editor\/oembed/,
        [200, {'Content-Type': 'application/json'}, JSON.stringify({html: '<iframe></iframe>'})]
      );

      // Cycle back to Twitter
      model.set('provider', 'twitter');
      expect(view.ui.input.val()).toBe('https://twitter.com/post/1');

      // Cycle to Bluesky
      model.set('provider', 'bluesky');
      expect(view.ui.input.val()).toBe('https://bsky.app/post/2');

      // Cycle to Instagram
      model.set('provider', 'instagram');
      expect(view.ui.input.val()).toBe('https://instagram.com/p/3');
    });

    it('clears validation state when no URL to restore', () => {
      const model = new Backbone.Model({
        url: '',
        displayUrl: '',
        provider: 'twitter'
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

      // Enter URL with validation error
      input.value = 'https://twitter.com/invalid';
      fireEvent.change(input);
      testContext.server.respond(
        'GET', /\/editor\/oembed/,
        [404, {'Content-Type': 'application/json'}, '']
      );

      // Verify error state
      expect(validation).toHaveTextContent('URL not found');
      expect(input).toBeInvalid();

      // Switch to Bluesky (no saved URL)
      model.set('provider', 'bluesky');

      // Verify validation error is cleared
      expect(view.ui.input.val()).toBe('');
      expect(validation.textContent).toBe('');
      expect(input).toBeValid();
    });
  });
});
