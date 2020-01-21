import Backbone from 'backbone';

import {TextTableCellView} from 'pageflow/ui';

import {UploadableFilesView} from 'pageflow/editor';

import * as support from '$support';
import {Table} from '$support/dominos/ui';

describe('UploadableFilesView', () => {
  var f = support.factories;

  it('renders confirmUploadTableColumns of file type', () => {
    var fileType = f.fileType({
      confirmUploadTableColumns: [
        {name: 'custom', cellView: TextTableCellView}
      ]
    });
    var view = new UploadableFilesView({
      collection: f.filesCollection({
        fileType: fileType
      }),
      fileType: fileType,
      selection: new Backbone.Model()
    });

    view.render();
    var table = Table.find(view);

    expect(table.columnNames()).toEqual(expect.arrayContaining(['custom']));
  });
});
