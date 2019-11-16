describe('pageflow.TextInputView', function() {
  it('supports disabled option', function() {
    var model = new Backbone.Model({});
    var textInputView = new pageflow.TextInputView({
      model: model,
      propertyName: 'name',
      disabled: true
    });

    textInputView.render();
    var input = textInputView.$el.find('input');

    expect(input).to.have.$attr('disabled', 'disabled');
  });

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

  describe('max length validation', function() {
    describe('for existing data exceeding specified maxLength', function() {
      it('skips validation', function() {
        var legacyTitle = new Array(300).join();
        var model = new Backbone.Model({title: legacyTitle});
        var textInputView = new pageflow.TextInputView({
          model: model,
          propertyName: 'title'
        });

        textInputView.render();

        expect(textInputView.$el.hasClass('invalid')).to.eq(false);
      });
    });

    describe('for new entries and data shorter than specified maxLength', function() {
      it('validates maximum character count with maxLength option', function() {
        var model = new Backbone.Model({});
        var textInputView = new pageflow.TextInputView({
          model: model,
          propertyName: 'title'
        });

        textInputView.render();

        var input = textInputView.$el.find('input');
        input.val(new Array(300).join());
        input.trigger('change');

        expect(textInputView.$el.hasClass('invalid')).to.eq(true);
      });
    });
  });
});