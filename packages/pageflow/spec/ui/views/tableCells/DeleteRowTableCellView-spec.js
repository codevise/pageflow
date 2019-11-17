import Backbone from 'backbone';
import sinon from 'sinon';

import {DeleteRowTableCellView} from '$pageflow/ui';

import * as support from '$support';

describe('DeleteRowTableCellView', () => {
  support.useFakeTranslations({
    'information.delete.cell_title': 'Delete information'
  });

  test('sets cell title attribute', () => {
    var kompromat = new Backbone.Model();
    var cell = new DeleteRowTableCellView({
      column: {
        name: 'delete'
      },
      model: kompromat,
      attributeTranslationKeyPrefixes: ['information']
    });

    cell.render();

    expect(cell.ui.removeButton).toHaveAttr('title', 'Delete information');
  });

  test('displays the delete button', () => {
    var kompromat = new Backbone.Model();
    var cell = new DeleteRowTableCellView({
      column: {
        name: 'delete'
      },
      model: kompromat
    });

    cell.render();

    expect(cell.ui.removeButton).toHaveClass('remove');
  });

  test(
    'displays the delete button when toggleDeleteButton returns true',
    () => {
      var Information = Backbone.Model.extend({
        subjectDeceased: function() {
          return true;
        }
      });
      var kompromat = new Information();
      var cell = new DeleteRowTableCellView({
        column: {
          name: 'delete'
        },
        model: kompromat,
        toggleDeleteButton: 'subjectDeceased'
      });

      cell.render();

      expect(cell.ui.removeButton).toHaveClass('remove');
    }
  );

  test(
    'does not display the delete button when toggleDeleteButton returns false',
    () => {
      var Information = Backbone.Model.extend({
        subjectDeceased: function() {
          return false;
        }
      });
      var kompromat = new Information();
      var cell = new DeleteRowTableCellView({
        column: {
          name: 'delete'
        },
        model: kompromat,
        toggleDeleteButton: 'subjectDeceased'
      });

      cell.render();

      expect(cell.ui.removeButton).not.toHaveClass('remove');
    }
  );

  test('displays the delete button when toggleDeleteButton returns false and ' +
     'invertToggleDeleteButton is true', () => {
       var Information = Backbone.Model.extend({
         subjectActive: function() {
           return false;
         }
       });
       var kompromat = new Information();
       var cell = new DeleteRowTableCellView({
         column: {
           name: 'delete'
         },
         model: kompromat,
         toggleDeleteButton: 'subjectActive',
         invertToggleDeleteButton: true
       });

       cell.render();

       expect(cell.ui.removeButton).toHaveClass('remove');
     });

  test(
    'does not display the delete button when toggleDeleteButton returns true and '+
       'invertToggleDeleteButton is true',
    () => {
         var Information = Backbone.Model.extend({
           subjectActive: function() {
             return true;
           }
         });
         var kompromat = new Information();
         var cell = new DeleteRowTableCellView({
           column: {
             name: 'delete'
           },
           model: kompromat,
           toggleDeleteButton: 'subjectActive',
           invertToggleDeleteButton: true
         });

         cell.render();

         expect(cell.ui.removeButton).not.toHaveClass('remove');
       }
  );

  test('removes model when button is clicked', () => {
    var kompromat = new Backbone.Model();
    sinon.spy(kompromat, 'destroy');
    var cell = new DeleteRowTableCellView({
      column: {
        name: 'delete'
      },
      model: kompromat
    });

    cell.render();

    cell.ui.removeButton.click();

    expect(kompromat.destroy).toHaveBeenCalled();
  });
});
