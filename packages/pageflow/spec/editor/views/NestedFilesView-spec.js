import Backbone from 'backbone';

import {TextTableCellView} from 'pageflow/ui';

import {NestedFilesView} from 'pageflow/editor';

import * as support from '$support';
import {Table} from '$support/dominos/ui';

describe('NestedFilesView', () => {
  var f = support.factories;

  it('renders nestedFileTableColumns of file type', () => {
    var fileType = f.fileType({
      nestedFileTableColumns: [
        {name: 'predicted_infractions', cellView: TextTableCellView}
      ]
    });
    var view = new NestedFilesView({
      collection: f.nestedFilesCollection({
        fileType: fileType,
        parentFileName: 'video.mp4'
      }),
      fileType: fileType,
      selection: new Backbone.Model()
    });

    view.render();
    var table = Table.find(view);

    expect(table.columnNames()).toEqual(expect.arrayContaining(['predicted_infractions']));
  });
});
