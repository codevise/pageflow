import {ModelThumbnailView} from '$pageflow/editor';

import * as support from '$support';
import {FileThumbnailView, StaticThumbnailView} from '$support/dominos/editor';

describe('ModelThumbnailView', () => {
  var f = support.factories;

  test(
    'uses FileThumbnailView when model offers thumbnailFile function',
    () => {
      var view = new ModelThumbnailView({
        model: f.file({thumbnail_url: 'picture_of_an_actual_thumb_nail.gif'})
      });

      view.render();
      var fileThumbnailView = FileThumbnailView.find(view);

      expect(fileThumbnailView.backgroundImage()).toEqual(expect.arrayContaining(['actual_thumb_nail']));
    }
  );

  test(
    'uses StaticThumbnailView when model does not offer thumbnailFile function',
    () => {
      var view = new ModelThumbnailView({
        model: f.theme({preview_thumbnail_url: 'file_for_use_on_thumb_nails.jpeg'})
      });

      view.render();
      var staticThumbnailView = StaticThumbnailView.find(view);

      expect(staticThumbnailView.backgroundImage()).toEqual(expect.arrayContaining(['file_for_use_on_thumb_nails']));
    }
  );
});
