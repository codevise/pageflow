describe('pageflow.ColorInputView', function() {
  support.useHtmlSandbox();

  beforeEach(function () {
    this.clock = sinon.useFakeTimers();
  });

  afterEach(function () {
    this.clock.restore();
  });

  it('loads value into input', function() {
    var model = new Backbone.Model({
      color: '#ababab'
    });
    var colorInputView = new pageflow.ColorInputView({
      model: model,
      propertyName: 'color'
    });

    var colorInputViewDomino = support.dom.ColorInputView.render(colorInputView);

    expect(colorInputViewDomino.value()).to.eq('#ababab');
  });

  it('updates input when model changes', function() {
    var model = new Backbone.Model();
    var colorInputView = new pageflow.ColorInputView({
      model: model,
      propertyName: 'color'
    });

    var colorInputViewDomino = support.dom.ColorInputView.render(colorInputView);
    model.set('color', '#ababab');

    expect(colorInputViewDomino.value()).to.eq('#ababab');
  });

  it('saves value to model on change', function() {
    var model = new Backbone.Model({
      color: '#ababab'
    });
    var colorInputView = new pageflow.ColorInputView({
      model: model,
      propertyName: 'color'
    });

    var colorInputViewDomino = support.dom.ColorInputView.render(
      colorInputView,
      {appendTo: this.htmlSandbox}
    );
    colorInputViewDomino.fillIn('#bbb', this.clock);

    expect(model.get('color')).to.eq('#bbbbbb');
  });

  it('allows passing swatches', function() {
    var model = new Backbone.Model();
    var colorInputView = new pageflow.ColorInputView({
      model: model,
      propertyName: 'color',
      swatches: ['#cdcdcd', '#dedede']
    });

    var colorInputViewDomino = support.dom.ColorInputView.render(
      colorInputView,
      {appendTo: this.htmlSandbox}
    );

    expect(colorInputViewDomino.swatches()).to.eql(['rgb(205, 205, 205)', 'rgb(222, 222, 222)']);
  });

  describe('with defaultValue option', function() {
    it('falls back to default value', function() {
      var model = new Backbone.Model();
      var colorInputView = new pageflow.ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView
      );

      expect(colorInputViewDomino.value()).to.eq('#cdcdcd');
    });

    it('does not store default value in model', function() {
      var model = new Backbone.Model();
      var colorInputView = new pageflow.ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: this.htmlSandbox}
      );
      colorInputViewDomino.fillIn('#cdcdcd', this.clock);

      expect(model.has('color')).to.eq(false);
    });

    it('stores non default value in model', function() {
      var model = new Backbone.Model();
      var colorInputView = new pageflow.ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: this.htmlSandbox}
      );
      colorInputViewDomino.fillIn('#ababab', this.clock);

      expect(model.get('color')).to.eq('#ababab');
    });

    it('unsets attribute in model if choosing default value', function() {
      var model = new Backbone.Model({
        color: '#fff'
      });
      var colorInputView = new pageflow.ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd'
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: this.htmlSandbox}
      );
      colorInputViewDomino.fillIn('#cdcdcd', this.clock);

      expect(model.has('color')).to.eq(false);
    });

    it('includes swatch for default value', function() {
      var model = new Backbone.Model();
      var colorInputView = new pageflow.ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd',
        swatches: ['#dedede']
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: this.htmlSandbox}
      );

      expect(colorInputViewDomino.swatches()).to.eql(['rgb(205, 205, 205)', 'rgb(222, 222, 222)']);
    });

    it('does not duplicate swatch', function() {
      var model = new Backbone.Model();
      var colorInputView = new pageflow.ColorInputView({
        model: model,
        propertyName: 'color',
        defaultValue: '#cdcdcd',
        swatches: ['#dedede', '#cdcdcd']
      });

      var colorInputViewDomino = support.dom.ColorInputView.render(
        colorInputView,
        {appendTo: this.htmlSandbox}
      );

      expect(colorInputViewDomino.swatches()).to.eql(['rgb(205, 205, 205)', 'rgb(222, 222, 222)']);
    });
  });
});