import Backbone from 'backbone';

import {IconTableCellView} from '$pageflow/ui';

import * as support from '$support';

describe('IconTableCellView', () => {
  support.useFakeTranslations({
    'toxins.warning.cell_title.biohazard': 'Biogefährdung',
    'toxins.warning.cell_title.blank': 'Unbedenklich'
  });

  var icons = ['caustic', 'biohazard', 'radioactive'];

  test(
    'sets cell title attribute according to column attribute value',
    () => {
      var toxin = new Backbone.Model({warning: 'biohazard'});
      var cell = new IconTableCellView({
        column: {
          name: 'warning'
        },
        model: toxin,
        icons: icons,
        attributeTranslationKeyPrefixes: ['toxins']
      });

      cell.render();

      expect(cell.$el).to.have.$attr('title', 'Biogefährdung');
    }
  );

  test('sets cell title attribute if column is blank', () => {
    var toxin = new Backbone.Model();
    var cell = new IconTableCellView({
      column: {
        name: 'warning'
      },
      model: toxin,
      icons: icons,
      attributeTranslationKeyPrefixes: ['toxins']
    });

    cell.render();

    expect(cell.$el).to.have.$attr('title', 'Unbedenklich');
  });

  test('adds class corresponding to column attribute value', () => {
    var toxin = new Backbone.Model({warning: 'caustic'});
    var cell = new IconTableCellView({
      column: {
        name: 'warning'
      },
      model: toxin,
      icons: icons
    });

    cell.render();

    expect(cell.$el).to.have.$class('caustic');
  });

  test(
    'removes previous class when changing column attribute value',
    () => {
      var toxin = new Backbone.Model({warning: 'caustic'});
      var cell = new IconTableCellView({
        column: {
          name: 'warning'
        },
        model: toxin,
        icons: icons
      });

      cell.render();

      toxin.set('warning', 'radioactive');

      cell.render();

      expect(cell.$el).not.to.have.$class('caustic');
      expect(cell.$el).to.have.$class('radioactive');
    }
  );
});
