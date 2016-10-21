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
});