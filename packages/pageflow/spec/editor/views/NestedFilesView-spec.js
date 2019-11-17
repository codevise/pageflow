describe('NestedFilesView', () => {
  var f = support.factories;

  test('renders nestedFileTableColumns of file type', () => {
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

    expect(table.columnNames()).toEqual(expect.arrayContaining(['predicted_infractions']));
  });
});
