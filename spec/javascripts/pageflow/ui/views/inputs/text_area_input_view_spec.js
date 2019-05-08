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

  it('prefills url field with http:// when creating new link', function(done) {
    var model = new Backbone.Model({
      text: 'Some link'
    });
    var textAreaInputView = new pageflow.TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectAll(function() {
      textAreaInputViewDomino.clickLinkButton();
      textAreaInputViewDomino.clickSaveInLinkDialog();

      expect(model.get('text')).to.contain('href="http://"');
      done();
    });
  });

  it('allows creating url link', function(done) {
    var model = new Backbone.Model({
      text: 'Some link'
    });
    var textAreaInputView = new pageflow.TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectAll(function() {
      textAreaInputViewDomino.clickLinkButton();
      textAreaInputViewDomino.enterLinkUrl('https://example.com');
      textAreaInputViewDomino.clickSaveInLinkDialog();

      expect(model.get('text')).to.contain('href="https://example.com"');
      done();
    });
  });

  it('allows updating url link', function(done) {
    var model = new Backbone.Model({
      text: '<a href="https://new.example.com">Some link</a>'
    });
    var textAreaInputView = new pageflow.TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectAll(function() {
      textAreaInputViewDomino.clickLinkButton();
      textAreaInputViewDomino.enterLinkUrl('https://new.example.com');
      textAreaInputViewDomino.clickSaveInLinkDialog();

      expect(model.get('text')).to.contain('href="https://new.example.com"');
      done();
    });
  });

  it('creates target blank links by default', function(done) {
    var model = new Backbone.Model({
      text: 'Some link'
    });
    var textAreaInputView = new pageflow.TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectAll(function() {
      textAreaInputViewDomino.clickLinkButton();
      textAreaInputViewDomino.clickSaveInLinkDialog();

      expect(model.get('text')).to.contain('target="_blank"');
      done();
    });
  });

  it('allows creating target self link', function(done) {
    var model = new Backbone.Model({
      text: 'Some link'
    });
    var textAreaInputView = new pageflow.TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectAll(function() {
      textAreaInputViewDomino.clickLinkButton();
      textAreaInputViewDomino.toggleOpenInNewTab(false);
      textAreaInputViewDomino.clickSaveInLinkDialog();

      expect(model.get('text')).to.contain('target="_self"');
      done();
    });
  });

  it('allows removing links', function(done) {
    var model = new Backbone.Model({
      text: 'Some <a href="http://example.com">link</a>'
    });
    var textAreaInputView = new pageflow.TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectFirstLink(function() {
      textAreaInputViewDomino.clickRemoveLink();

      expect(model.get('text')).to.contain('Some link');
      done();
    });
  });

  describe('with fragmentLinkInputView option', function() {
    it('renders given view', function() {
      var model = new Backbone.Model({});
      var FragmentLinkInputView = Backbone.View.extend({
        className: 'some_fragment_link_input_view'
      });
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      textAreaInputView.render();

      expect(textAreaInputView.$el.find('.some_fragment_link_input_view').length).to.eq(1);
    });

    it('passes property value to fragment link view when selecting link', function(done) {
      var model = new Backbone.Model({
        text: 'Some <a href="#123">link</a>'
      });
      var propertyValue;
      var FragmentLinkInputView = Backbone.Marionette.View.extend({
        modelEvents: {
          'change': function() {
            propertyValue = this.model.get(this.options.propertyName);
          }
        }
      });
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectFirstLink(function() {
        expect(propertyValue).to.eq('123');
        done();
      });
    });

    it('updates link when view sets property value', function(done) {
      var model = new Backbone.Model({
        text: 'Some <a href="#123">link</a>'
      });
      var updateFragmentLink;
      var FragmentLinkInputView = Backbone.Marionette.View.extend({
        initialize: function() {
          updateFragmentLink = _.bind(function(value) {
            this.model.set(this.options.propertyName, value);
          }, this);
        }
      });
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectFirstLink(function() {
        updateFragmentLink(456);
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).to.contain('href="#456"');
        done();
      });
    });

    it('resets url field to http:// when switching from fragment link to url link', function(done) {
      var model = new Backbone.Model({
        text: 'Some <a href="#123">link</a>'
      });
      var FragmentLinkInputView = Backbone.Marionette.View.extend({});
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectFirstLink(function() {
        textAreaInputViewDomino.clickUrlLinkRadioButton();
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).to.contain('href="http://"');
        done();
      });
    });

    it('resets target to blank when switching from fragment link to url link', function(done) {
      var model = new Backbone.Model({
        text: 'Some <a href="#123" target="_self">link</a>'
      });
      var FragmentLinkInputView = Backbone.Marionette.View.extend({});
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectFirstLink(function() {
        textAreaInputViewDomino.clickUrlLinkRadioButton();
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).to.contain('target="_blank"');
        done();
      });
    });

    it('does not change fragment link when toggling link type back and forth', function(done) {
      var model = new Backbone.Model({
        text: 'Some <a href="#123">link</a>'
      });
      var FragmentLinkInputView = Backbone.Marionette.View.extend({});
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectFirstLink(function() {
        textAreaInputViewDomino.clickUrlLinkRadioButton();
        textAreaInputViewDomino.enterLinkUrl('https://example.com');
        textAreaInputViewDomino.clickFragmentLinkRadioButton();
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).to.contain('href="#123"');
        done();
      });
    });

    it('resets url to # when switching from url link to fragment link', function(done) {
      var model = new Backbone.Model({
        text: 'Some <a href="https://example.com">link</a>'
      });
      var FragmentLinkInputView = Backbone.Marionette.View.extend({});
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectFirstLink(function() {
        textAreaInputViewDomino.clickFragmentLinkRadioButton();
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).to.contain('href="#"');
        done();
      });
    });

    it('does not change url link when toggling link type back and forth', function(done) {
      var model = new Backbone.Model({
        text: 'Some <a href="http://example.com">link</a>'
      });
      var updateFragmentLink;
      var FragmentLinkInputView = Backbone.Marionette.View.extend({
        initialize: function() {
          updateFragmentLink = _.bind(function(value) {
            this.model.set(this.options.propertyName, value);
          }, this);
        }
      });
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectFirstLink(function() {
        textAreaInputViewDomino.clickFragmentLinkRadioButton();
        updateFragmentLink(123);
        textAreaInputViewDomino.clickUrlLinkRadioButton();
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).to.contain('href="http://example.com"');
        done();
      });
    });

    it('does not change url link target when toggling link type back and forth', function(done) {
      var model = new Backbone.Model({
        text: 'Some <a href="http://example.com" target="_self">link</a>'
      });
      var updateFragmentLink;
      var FragmentLinkInputView = Backbone.Marionette.View.extend({
        initialize: function() {
          updateFragmentLink = _.bind(function(value) {
            this.model.set(this.options.propertyName, value);
          }, this);
        }
      });
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectFirstLink(function() {
        textAreaInputViewDomino.clickFragmentLinkRadioButton();
        updateFragmentLink(123);
        textAreaInputViewDomino.clickUrlLinkRadioButton();
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).to.contain('target="_self"');
        done();
      });
    });

    it('allows creating url link', function(done) {
      var model = new Backbone.Model({
        text: 'Some link'
      });
      var FragmentLinkInputView = Backbone.Marionette.View.extend({});
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectAll(function() {
        textAreaInputViewDomino.clickLinkButton();
        textAreaInputViewDomino.enterLinkUrl('https://example.com');
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).to.contain('href="https://example.com"');
        done();
      });
    });

    it('allows creating fragment link', function(done) {
      var model = new Backbone.Model({
        text: 'Some link'
      });
      var updateFragmentLink;
      var FragmentLinkInputView = Backbone.Marionette.View.extend({
        initialize: function() {
          updateFragmentLink = _.bind(function(value) {
            this.model.set(this.options.propertyName, value);
          }, this);
        }
      });
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectAll(function() {
        textAreaInputViewDomino.clickLinkButton();
        textAreaInputViewDomino.clickFragmentLinkRadioButton();
        updateFragmentLink(123);
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).to.contain('href="#123"');
        done();
      });
    });

    it('creates fragment link with target self', function(done) {
      var model = new Backbone.Model({
        text: 'Some link'
      });
      var FragmentLinkInputView = Backbone.Marionette.View.extend({});
      var textAreaInputView = new pageflow.TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectAll(function() {
        textAreaInputViewDomino.clickLinkButton();
        textAreaInputViewDomino.clickFragmentLinkRadioButton();
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).to.contain('target="_self"');
        done();
      });
    });
  });
});
