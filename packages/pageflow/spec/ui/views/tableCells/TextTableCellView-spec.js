import Backbone from 'backbone';

import {TextTableCellView} from '$pageflow/ui';

import * as support from '$support';

describe('TextTableCellView', () => {
  support.useFakeTranslations({
    'pageflow.ui.text_table_cell_view.empty': '(empty)'
  });

  test(
    'renders value from column attribute also when default is given',
    () => {
      var person = new Backbone.Model({first_name: 'Jane'});
      var cell = new TextTableCellView({
        column: {
          name: 'first_name',
          default: 'Heinz'
        },
        model: person
      });

      cell.render();

      expect(cell.$el).to.have.$text('Jane');
    }
  );

  test(
    'renders default value if column attribute is empty and default is present',
    () => {
      var passport = new Backbone.Model({issuing_authority: 'Studienstelle für Auslandsfragen'});
      var cell = new TextTableCellView({
        column: {
          name: 'country',
          default: 'China'
        },
        model: passport
      });

      cell.render();

      expect(cell.$el).to.have.$text('China');
    }
  );

  test(
    'renders default value if column attribute is empty and default is not present',
    () => {
      var passport = new Backbone.Model({issuing_authority: 'Studienstelle für Auslandsfragen'});
      var cell = new TextTableCellView({
        column: {
          name: 'country'
        },
        model: passport
      });

      cell.render();

      expect(cell.$el).to.have.$text('(empty)');
    }
  );

  test(
    'renders return value of default function if column attribute is empty',
    () => {
      var passport = new Backbone.Model({issuing_authority: 'Studienstelle für Auslandsfragen'});
      var cell = new TextTableCellView({
        column: {
          name: 'country',
          default: function() {
            return 'Italy';
          }
        },
        model: passport
      });

      cell.render();

      expect(cell.$el).to.have.$text('Italy');
    }
  );

  test(
    'renders return value of default function if column attribute is empty',
    () => {
      var passport = new Backbone.Model({place_of_birth: 'Baarle'});
      var cell = new TextTableCellView({
        column: {
          name: 'country',
          default: function(options) {
            return 'Whichever country ' + options.model.get(options.contentBinding) + ' is located in';
          },
          contentBinding: 'place_of_birth'
        },
        model: passport
      });

      cell.render();

      expect(cell.$el).to.have.$text('Whichever country Baarle is located in');
    }
  );
});
