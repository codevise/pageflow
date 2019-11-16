import Backbone from 'backbone';

import {JsonInputView} from '$pageflow/ui';

describe('pageflow.JsonInputView', () => {
  test('displays attribute value as pretty printed JSON', () => {
    var model = new Backbone.Model({
      json: {some: 'data'}
    });
    var jsonInputView = new JsonInputView({
      model: model,
      propertyName: 'json'
    });

    jsonInputView.render();

    var textArea = jsonInputView.$el.find('textarea');

    expect(textArea.val()).toBe('{\n  "some": "data"\n}');
  });

  test('saves parsed JSON to attribute if valid', () => {
    var model = new Backbone.Model();
    var jsonInputView = new JsonInputView({
      model: model,
      propertyName: 'json'
    });

    jsonInputView.render();

    var textArea = jsonInputView.$el.find('textarea');
    textArea.val('{"some": "data"}');
    textArea.trigger('change');

    expect(model.get('json')).toEqual({some: 'data'});
  });

  test('sets attribute to null if text is empty', () => {
    var model = new Backbone.Model({
      json: {some: 'data'}
    });
    var jsonInputView = new JsonInputView({
      model: model,
      propertyName: 'json'
    });

    jsonInputView.render();

    var textArea = jsonInputView.$el.find('textarea');
    textArea.val('');
    textArea.trigger('change');

    expect(model.get('json')).toBeNull();
  });

  test('does save invalid JSON but displays validation error', () => {
    var model = new Backbone.Model({
      json: {some: 'data'}
    });
    var jsonInputView = new JsonInputView({
      model: model,
      propertyName: 'json'
    });

    jsonInputView.render();

    var textArea = jsonInputView.$el.find('textarea');
    textArea.val('{not "json"}');
    textArea.trigger('change');

    expect(jsonInputView.$el).to.have.$class('invalid');
    expect(model.get('json')).toEqual({some: 'data'});
  });
});
