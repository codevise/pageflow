import {Configuration} from '$pageflow/editor';

import {FileProcessingStateDisplayView} from '$pageflow/editor';

import * as support from '$support';
import {FileStageItemView} from '$support/dominos/editor';

describe('pageflow.FileProcessingStateDisplayView', () => {
  test('displays unfinished file stages', () => {
    var fixture = support.factories.imageFilesFixture({
      imageFileAttributes: {
        id: 1,
        perma_id: 5,
        state: 'processing'
      }
    });
    var model = new Configuration({
      imageFileId: 5
    });
    var view = new FileProcessingStateDisplayView({
      collection: fixture.imageFiles,
      propertyName: 'imageFileId',
      model: model
    });

    view.render();

    expect(FileStageItemView.findAll(view).length).toBe(1);
    expect(view.$el).not.toHaveClass('file_processing_state_display-empty');
  });

  test('does not display finished file stages', () => {
    var fixture = support.factories.imageFilesFixture({
      imageFileAttributes: {
        id: 1,
        perma_id: 5,
        state: 'processed'
      }
    });
    var model = new Configuration({
      imageFileId: 5
    });
    var view = new FileProcessingStateDisplayView({
      collection: fixture.imageFiles,
      propertyName: 'imageFileId',
      model: model
    });

    view.render();

    expect(FileStageItemView.findAll(view).length).toBe(0);
    expect(view.$el).toHaveClass('file_processing_state_display-empty');
  });
});
