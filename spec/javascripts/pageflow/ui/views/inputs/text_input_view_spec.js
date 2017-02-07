describe('pageflow.TextInputView', function() {
  it('supports placeholder text', function() {
    var model = new Backbone.Model({});
    var textInputView = new pageflow.TextInputView({
      model: model,
      propertyName: 'name',
      placeholder: 'Default'
    });

    textInputView.render();
    var input = textInputView.$el.find('input');

    expect(input).to.have.$attr('placeholder', 'Default');
  });

  it('supports placeholder as function', function() {
    var model = new Backbone.Model({other: 'otherValue'});
    var textInputView = new pageflow.TextInputView({
      model: model,
      propertyName: 'name',
      placeholder: function(m) {
        return m.get('other');
      }
    });

    textInputView.render();
    var input = textInputView.$el.find('input');

    expect(input).to.have.$attr('placeholder', 'otherValue');
  });

  it('updates placeholder when placeholderBinding attribute changes', function() {
    var model = new Backbone.Model({other: 'old'});
    var textInputView = new pageflow.TextInputView({
      model: model,
      propertyName: 'name',
      placeholder: function(m) {
        return m.get('other');
      },
      placeholderBinding: 'other'
    });

    textInputView.render();
    var input = textInputView.$el.find('input');
    model.set('other', 'new');

    expect(input).to.have.$attr('placeholder', 'new');
  });

  it('supports reading placeholder from other model', function() {
    var placeholderModel = new Backbone.Model({name: 'otherValue'});
    var model = new Backbone.Model({});
    var textInputView = new pageflow.TextInputView({
      model: model,
      propertyName: 'name',
      placeholderModel: placeholderModel
    });

    textInputView.render();
    var input = textInputView.$el.find('input');

    expect(input).to.have.$attr('placeholder', 'otherValue');
  });
});