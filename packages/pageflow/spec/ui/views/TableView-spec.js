import $ from 'jquery';
import Backbone from 'backbone';

import {TableCellView, TableView, TextTableCellView} from '$pageflow/ui';

import * as support from '$support';

describe('TableView', () => {
  it('renders a table with rows of cells for collection items', () => {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var tableView = new TableView({
      collection: collection,
      columns: [
        {name: 'firstName', cellView: TextTableCellView}
      ]
    });

    tableView.render();

    expect(tableView.$el.is('table')).toBe(true);
    expect(tableView.$el.find('tbody tr td').map(function() {
      return $(this).text();
    }).get()).toEqual(['Claire', 'John']);
  });

  it('adds selected class to row for selected model', () => {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var selection = new Backbone.Model();
    var tableView = new TableView({
      collection: collection,
      columns: [
        {name: 'firstName', cellView: TextTableCellView}
      ],
      selection: selection
    });

    tableView.render();
    selection.set('current', collection.last());

    expect(tableView.$el.find('tbody tr.is_selected td')).toHaveText('John');
  });

  it('allows setting a custom selection attribute name', () => {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var selection = new Backbone.Model();
    var tableView = new TableView({
      collection: collection,
      columns: [
        {name: 'firstName', cellView: TextTableCellView}
      ],
      selection: selection,
      selectionAttribute: 'person'
    });

    tableView.render();
    selection.set('person', collection.last());

    expect(tableView.$el.find('tbody tr.is_selected td')).toHaveText('John');
  });

  it('sets selection when row is clicked', () => {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var selection = new Backbone.Model();
    var tableView = new TableView({
      collection: collection,
      columns: [
        {name: 'firstName', cellView: TextTableCellView}
      ],
      selection: selection
    });

    tableView.render();
    tableView.$el.find('tbody tr:last-child td').click();

    expect(selection.get('current')).toBe(collection.last());
  });

  it('sets custom selection attribute when row is clicked', () => {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var selection = new Backbone.Model();
    var tableView = new TableView({
      collection: collection,
      columns: [
        {name: 'firstName', cellView: TextTableCellView}
      ],
      selection: selection,
      selectionAttribute: 'person'
    });

    tableView.render();
    tableView.$el.find('tbody tr:last-child td').click();

    expect(selection.get('person')).toBe(collection.last());
  });

  it('allows passing options for cell views', () => {
    var collection = new Backbone.Collection([{firstName: 'Claire'}, {firstName: 'John'}]);
    var tableView = new TableView({
      collection: collection,
      columns: [
        {
          name: 'firstName',
          cellView: TextTableCellView,
          cellViewOptions: {
            className: 'custom'
          }
        }
      ]
    });

    tableView.render();

    expect(tableView.$el.find('tbody tr td.custom').length).toBe(2);
  });

  describe('attributeTranslationKeyPrefixes option', () => {
    support.useFakeTranslations({
      'columns.first_name.column_header': 'First Name',
      'columns.last_name.column_header': 'Last Name',

      'columns.first_name.text': 'Test'
    });

    it('is used for column header texts', () => {
      var collection = new Backbone.Collection();
      var tableView = new TableView({
        collection: collection,
        columns: [
          {
            name: 'first_name',
            cellView: TextTableCellView
          },
          {
            name: 'last_name',
            cellView: TextTableCellView
          }
        ],
        attributeTranslationKeyPrefixes: [
          'columns'
        ]
      });

      tableView.render();

      expect(tableView.$el.find('thead th').map(function() {
        return $(this).text();
      }).get()).toEqual(['First Name', 'Last Name']);
    });

    it('can be used inside cells', () => {
      var collection = new Backbone.Collection([{}]);
      var CellView = TableCellView.extend({
        update: function() {
          this.$el.text(this.attributeTranslation('text'));
        }
      });
      var tableView = new TableView({
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

      expect(tableView.$el.find('tbody td')).toHaveText('Test');
    });
  });
});
