describe('TextTableCellView', function() {
  it('renders value from column attribute', function() {
    var person = new Backbone.Model({first_name: 'Jane'});
    var cell = new pageflow.TextTableCellView({
      column: {
        name: 'first_name'
      },
      model: person
    });

    cell.render();

    expect(cell.$el).to.have.$text('Jane');
  });

  it('renders default value if column attribute is empty', function() {
    var passport = new Backbone.Model({issuing_authority: 'Studienstelle für Auslandsfragen'});
    var cell = new pageflow.TextTableCellView({
      column: {
        name: 'country',
        default: 'China'
      },
      model: passport
    });

    cell.render();

    expect(cell.$el).to.have.$text('China');
  });
});
