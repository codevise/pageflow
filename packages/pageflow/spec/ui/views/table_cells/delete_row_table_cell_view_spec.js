describe('DeleteRowTableCellView', function() {
  support.useFakeTranslations({
    'information.delete.cell_title': 'Delete information'
  });

  it('sets cell title attribute', function() {
    var kompromat = new Backbone.Model();
    var cell = new pageflow.DeleteRowTableCellView({
      column: {
        name: 'delete'
      },
      model: kompromat,
      attributeTranslationKeyPrefixes: ['information']
    });

    cell.render();

    expect(cell.ui.removeButton).to.have.$attr('title', 'Delete information');
  });

  it('displays the delete button', function() {
    var kompromat = new Backbone.Model();
    var cell = new pageflow.DeleteRowTableCellView({
      column: {
        name: 'delete'
      },
      model: kompromat
    });

    cell.render();

    expect(cell.ui.removeButton).to.have.$class('remove');
  });

  it('displays the delete button when toggleDeleteButton returns true', function() {
    var Information = Backbone.Model.extend({
      subjectDeceased: function() {
        return true;
      }
    });
    var kompromat = new Information();
    var cell = new pageflow.DeleteRowTableCellView({
      column: {
        name: 'delete'
      },
      model: kompromat,
      toggleDeleteButton: 'subjectDeceased'
    });

    cell.render();

    expect(cell.ui.removeButton).to.have.$class('remove');
  });

  it('does not display the delete button when toggleDeleteButton returns false', function() {
    var Information = Backbone.Model.extend({
      subjectDeceased: function() {
        return false;
      }
    });
    var kompromat = new Information();
    var cell = new pageflow.DeleteRowTableCellView({
      column: {
        name: 'delete'
      },
      model: kompromat,
      toggleDeleteButton: 'subjectDeceased'
    });

    cell.render();

    expect(cell.ui.removeButton).not.to.have.$class('remove');
  });

  it('displays the delete button when toggleDeleteButton returns false and ' +
     'invertToggleDeleteButton is true', function() {
       var Information = Backbone.Model.extend({
         subjectActive: function() {
           return false;
         }
       });
       var kompromat = new Information();
       var cell = new pageflow.DeleteRowTableCellView({
         column: {
           name: 'delete'
         },
         model: kompromat,
         toggleDeleteButton: 'subjectActive',
         invertToggleDeleteButton: true
       });

       cell.render();

       expect(cell.ui.removeButton).to.have.$class('remove');
     });

  it('does not display the delete button when toggleDeleteButton returns true and '+
     'invertToggleDeleteButton is true', function() {
       var Information = Backbone.Model.extend({
         subjectActive: function() {
           return true;
         }
       });
       var kompromat = new Information();
       var cell = new pageflow.DeleteRowTableCellView({
         column: {
           name: 'delete'
         },
         model: kompromat,
         toggleDeleteButton: 'subjectActive',
         invertToggleDeleteButton: true
       });

       cell.render();

       expect(cell.ui.removeButton).not.to.have.$class('remove');
     });

  it('removes model when button is clicked', function() {
    var kompromat = new Backbone.Model();
    sinon.spy(kompromat, 'destroy');
    var cell = new pageflow.DeleteRowTableCellView({
      column: {
        name: 'delete'
      },
      model: kompromat
    });

    cell.render();

    cell.ui.removeButton.click();

    expect(kompromat.destroy).to.have.been.called;
  });
});
