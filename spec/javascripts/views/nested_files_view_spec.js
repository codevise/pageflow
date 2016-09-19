describe('NestedFilesView', function() {
  var f = support.factories;

  it('renders nestedFileTableColumns of file type', function() {
    var fileType = f.fileType({
      nestedFileTableColumns: [
        {name: 'predicted_infractions', cellView: pageflow.TextTableCellView}
      ]
    });
    var view = new pageflow.NestedFilesView({
      collection: f.nestedFilesCollection({
        fileType: fileType,
        parentFileName: 'video.mp4'
      }),
      fileType: fileType,
      selection: new Backbone.Model()
    });

    view.render();
    var table = support.dom.Table.find(view);

    expect(table.columnNames()).to.contain('predicted_infractions');
  });
});
