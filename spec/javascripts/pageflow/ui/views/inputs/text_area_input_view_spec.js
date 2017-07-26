describe('pageflow.TextAreaInputView', function() {
  it('supports disabled option', function() {
    var model = new Backbone.Model({});
    var textAreaInputView = new pageflow.TextAreaInputView({
      model: model,
      propertyName: 'name',
      disabled: true
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');

    expect(input).to.have.$attr('disabled', 'disabled');
  });

  it('supports placeholder text', function() {
    var model = new Backbone.Model({});
    var textAreaInputView = new pageflow.TextAreaInputView({
      model: model,
      propertyName: 'name',
      placeholder: 'Default'
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');

    expect(input).to.have.$attr('placeholder', 'Default');
  });

  it('supports placeholder as function', function() {
    var model = new Backbone.Model({other: 'otherValue'});
    var textAreaInputView = new pageflow.TextAreaInputView({
      model: model,
      propertyName: 'name',
      placeholder: function(m) {
        return m.get('other');
      }
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');

    expect(input).to.have.$attr('placeholder', 'otherValue');
  });

  it('updates placeholder when placeholderBinding attribute changes', function() {
    var model = new Backbone.Model({other: 'old'});
    var textAreaInputView = new pageflow.TextAreaInputView({
      model: model,
      propertyName: 'name',
      placeholder: function(m) {
        return m.get('other');
      },
      placeholderBinding: 'other'
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');
    model.set('other', 'new');

    expect(input).to.have.$attr('placeholder', 'new');
  });

  it('supports reading placeholder from other model', function() {
    var placeholderModel = new Backbone.Model({name: 'otherValue'});
    var model = new Backbone.Model({});
    var textAreaInputView = new pageflow.TextAreaInputView({
      model: model,
      propertyName: 'name',
      placeholderModel: placeholderModel
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');

    expect(input).to.have.$attr('placeholder', 'otherValue');
  });
});