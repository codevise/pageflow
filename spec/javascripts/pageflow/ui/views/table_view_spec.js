describe('TableView', function() {
  var $ = jQuery;

  it('renders a table with rows of cells for collection items', function() {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var tableView = new pageflow.TableView({
      collection: collection,
      columns: [
        {name: 'firstName', cellView: pageflow.TextTableCellView}
      ]
    });

    tableView.render();

    expect(tableView.$el.is('table')).to.eq(true);
    expect(tableView.$el.find('tbody tr td').map(function() {
      return $(this).text();
    }).get()).to.eql(['Claire', 'John']);
  });

  it('adds selected class to row for selected model', function() {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var selection = new Backbone.Model();
    var tableView = new pageflow.TableView({
      collection: collection,
      columns: [
        {name: 'firstName', cellView: pageflow.TextTableCellView}
      ],
      selection: selection
    });

    tableView.render();
    selection.set('current', collection.last());

    expect(tableView.$el.find('tbody tr.is_selected td')).to.have.$text('John');
  });

  it('allows setting a custom selection attribute name', function() {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var selection = new Backbone.Model();
    var tableView = new pageflow.TableView({
      collection: collection,
      columns: [
        {name: 'firstName', cellView: pageflow.TextTableCellView}
      ],
      selection: selection,
      selectionAttribute: 'person'
    });

    tableView.render();
    selection.set('person', collection.last());

    expect(tableView.$el.find('tbody tr.is_selected td')).to.have.$text('John');
  });

  it('sets selection when row is clicked', function() {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var selection = new Backbone.Model();
    var tableView = new pageflow.TableView({
      collection: collection,
      columns: [
        {name: 'firstName', cellView: pageflow.TextTableCellView}
      ],
      selection: selection
    });

    tableView.render();
    tableView.$el.find('tbody tr:last-child td').click();

    expect(selection.get('current')).to.eq(collection.last());
  });

  it('sets custom selection attribute when row is clicked', function() {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var selection = new Backbone.Model();
    var tableView = new pageflow.TableView({
      collection: collection,
      columns: [
        {name: 'firstName', cellView: pageflow.TextTableCellView}
      ],
      selection: selection,
      selectionAttribute: 'person'
    });

    tableView.render();
    tableView.$el.find('tbody tr:last-child td').click();

    expect(selection.get('person')).to.eq(collection.last());
  });

  it('allows passing options for cell views', function() {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var tableView = new pageflow.TableView({
      collection: collection,
      columns: [
        {
          name: 'firstName',
          cellView: pageflow.TextTableCellView,
          cellViewOptions: {
            className: 'custom'
          }
        }
      ]
    });

    tableView.render();

    expect(tableView.$el.find('tbody tr td.custom').length).to.eq(2);
  });

  describe('attributeTranslationKeyPrefixes option', function() {
    support.useFakeTranslations({
      'columns.first_name.column_header': 'First Name',
      'columns.last_name.column_header': 'Last Name',

      'columns.first_name.text': 'Test'
    });

    it('is used for column header texts', function() {
      var collection = new Backbone.Collection();
      var tableView = new pageflow.TableView({
        collection: collection,
        columns: [
          {
            name: 'first_name',
            cellView: pageflow.TextTableCellView
          },
          {
            name: 'last_name',
            cellView: pageflow.TextTableCellView
          }
        ],
        attributeTranslationKeyPrefixes: [
          'columns'
        ]
      });

      tableView.render();

      expect(tableView.$el.find('thead th').map(function() {
        return $(this).text();
      }).get()).to.eql(['First Name', 'Last Name']);
    });

    it('can be used inside cells', function() {
      var collection = new Backbone.Collection([{}]);
      var CellView = pageflow.TableCellView.extend({
        update: function() {
          this.$el.text(this.attributeTranslation('text'));
        }
      });
      var tableView = new pageflow.TableView({
        collection: collection,
        columns: [
          {
            name: 'first_name',
            cellView: CellView
          }
        ],
        attributeTranslationKeyPrefixes: [
          'columns'
        ]
      });

      tableView.render();

      expect(tableView.$el.find('tbody td')).to.have.$text('Test');
    });
  });
});