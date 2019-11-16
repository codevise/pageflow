import Backbone from 'backbone';

import {PresenceTableCellView} from '$pageflow/ui';

import * as support from '$support';

describe('PresenceTableCellView', () => {
  support.useFakeTranslations({
    'columns.first_name.cell_title.present': 'Present: %{value}',
    'columns.first_name.cell_title.blank': 'Blank',
  });

  test(
    'sets cell title attribute with interpolation if column attribute is present',
    () => {
      var person = new Backbone.Model({first_name: 'Jane'});
      var cell = new PresenceTableCellView({
        column: {
          name: 'first_name'
        },
        model: person,
        attributeTranslationKeyPrefixes: ['columns']
      });

      cell.render();

      expect(cell.$el).toHaveAttr('title', 'Present: Jane');
    }
  );

  test('sets cell title attribute if column attribute is blank', () => {
    var person = new Backbone.Model({first_name: ''});
    var cell = new PresenceTableCellView({
      column: {
        name: 'first_name'
      },
      model: person,
      attributeTranslationKeyPrefixes: ['columns']
    });

    cell.render();

    expect(cell.$el).toHaveAttr('title', 'Blank');
  });

  test('adds is_present class if column attribute is present', () => {
    var person = new Backbone.Model({first_name: 'Jane'});
    var cell = new PresenceTableCellView({
      column: {
        name: 'first_name'
      },
      model: person
    });

    cell.render();

    expect(cell.$el).toHaveClass('is_present');
  });

  test('does not add is_present class if column attribute is blank', () => {
    var person = new Backbone.Model({first_name: ''});
    var cell = new PresenceTableCellView({
      column: {
        name: 'first_name'
      },
      model: person
    });

    cell.render();

    expect(cell.$el).not.toHaveClass('is_present');
  });
});