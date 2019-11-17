describe('DropDownButtonView', function() {
  it('renders menu items for collection items', function() {
    var dropDownButtonView = new pageflow.DropDownButtonView({
      items: new Backbone.Collection([
        {label: 'Item 1'},
        {label: 'Item 2'}
      ])
    });

    dropDownButtonView.render();
    var itemTexts = mapToText(dropDownButtonView.$el.find('ul li a'));

    expect(itemTexts).to.eql(['Item 1', 'Item 2']);
  });

  it('renders nested menu items', function() {
    var dropDownButtonView = new pageflow.DropDownButtonView({
      items: new Backbone.Collection([
        {
          label: 'Group 1',
          items: new Backbone.Collection([
            {label: 'Item 1'},
            {label: 'Item 2'},
          ])
        }
      ])
    });

    dropDownButtonView.render();
    var itemTexts = mapToText(dropDownButtonView.$el.find('li li a'));

    expect(itemTexts).to.eql(['Item 1', 'Item 2']);
  });

  it('supports disabling items', function() {
    var dropDownButtonView = new pageflow.DropDownButtonView({
      items: new Backbone.Collection([
        {label: 'Item 1', disabled: true},
        {label: 'Item 2'}
      ])
    });

    dropDownButtonView.render();
    var items = dropDownButtonView.$el.find('ul li');

    expect(items.eq(0)).to.have.$class('is_disabled');
    expect(items.eq(1)).not.to.have.$class('is_disabled');
  });

  it('supports checking items', function() {
    var dropDownButtonView = new pageflow.DropDownButtonView({
      items: new Backbone.Collection([
        {label: 'Item 1', checked: true},
        {label: 'Item 2'}
      ])
    });

    dropDownButtonView.render();
    var items = dropDownButtonView.$el.find('ul li');

    expect(items.eq(0)).to.have.$class('is_checked');
    expect(items.eq(1)).not.to.have.$class('is_checked');
  });

  it('marks items whose model has a selected method', function() {
    var itemModels = new Backbone.Collection([
      {label: 'Item 1'},
      {label: 'Item 2'}
    ]);
    itemModels.first().selected = function() {};
    var dropDownButtonView = new pageflow.DropDownButtonView({
      items: itemModels
    });

    dropDownButtonView.render();
    var items = dropDownButtonView.$el.find('ul li');

    expect(items.eq(0)).to.have.$class('is_selectable');
    expect(items.eq(1)).not.to.have.$class('is_selectable');
  });

  it('calls selected function on model when item is clicked', function() {
    var itemModels = new Backbone.Collection([
      {label: 'Item 1'}
    ]);
    var selectedHandler = sinon.spy();
    itemModels.first().selected = selectedHandler;
    var dropDownButtonView = new pageflow.DropDownButtonView({
      items: itemModels
    });

    dropDownButtonView.render();
    dropDownButtonView.$el.find('ul li a').first().trigger('click');

    expect(selectedHandler).to.have.been.called;
  });

  it('does not call selected method on model when disabled item is clicked', function() {
    var itemModels = new Backbone.Collection([
      {label: 'Item 1', disabled: true}
    ]);
    var selectedHandler = sinon.spy();
    itemModels.first().selected = selectedHandler;
    var dropDownButtonView = new pageflow.DropDownButtonView({
      items: itemModels
    });

    dropDownButtonView.render();
    dropDownButtonView.$el.find('ul li a').first().trigger('click');

    expect(selectedHandler).not.to.have.been.called;
  });

  function mapToText(el) {
    return el.map(function() {
      return $(this).text().trim();
    }).get();
  }
});