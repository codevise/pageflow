describe('pageflow.JsonInputView', function() {
  it('displays attribute value as pretty printed JSON', function() {
    var model = new Backbone.Model({
      json: {some: 'data'}
    });
    var jsonInputView = new pageflow.JsonInputView({
      model: model,
      propertyName: 'json'
    });

    jsonInputView.render();

    var textArea = jsonInputView.$el.find('textarea');

    expect(textArea.val()).to.eq('{\n  "some": "data"\n}');
  });

  it('saves parsed JSON to attribute if valid', function() {
    var model = new Backbone.Model();
    var jsonInputView = new pageflow.JsonInputView({
      model: model,
      propertyName: 'json'
    });

    jsonInputView.render();

    var textArea = jsonInputView.$el.find('textarea');
    textArea.val('{"some": "data"}');
    textArea.trigger('change');

    expect(model.get('json')).to.eql({some: 'data'});
  });

  it('sets attribute to null if text is empty', function() {
    var model = new Backbone.Model({
      json: {some: 'data'}
    });
    var jsonInputView = new pageflow.JsonInputView({
      model: model,
      propertyName: 'json'
    });

    jsonInputView.render();

    var textArea = jsonInputView.$el.find('textarea');
    textArea.val('');
    textArea.trigger('change');

    expect(model.get('json')).to.eq(null);
  });

  it('does save invalid JSON but displays validation error', function() {
    var model = new Backbone.Model({
      json: {some: 'data'}
    });
    var jsonInputView = new pageflow.JsonInputView({
      model: model,
      propertyName: 'json'
    });

    jsonInputView.render();

    var textArea = jsonInputView.$el.find('textarea');
    textArea.val('{not "json"}');
    textArea.trigger('change');

    expect(jsonInputView.$el).to.have.$class('invalid');
    expect(model.get('json')).to.eql({some: 'data'});
  });
});
