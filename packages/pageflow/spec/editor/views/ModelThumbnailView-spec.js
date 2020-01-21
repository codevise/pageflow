import {ModelThumbnailView} from 'pageflow/editor';

import * as support from '$support';
import {FileThumbnail, StaticThumbnail} from '$support/dominos/editor';

describe('ModelThumbnailView', () => {
  var f = support.factories;

  it(
    'uses FileThumbnailView when model offers thumbnailFile function',
    () => {
      var view = new ModelThumbnailView({
        model: f.file({thumbnail_url: 'picture_of_an_actual_thumb_nail.gif'})
      });

      view.render();
      var fileThumbnail = FileThumbnail.find(view);

      expect(fileThumbnail.backgroundImage()).toContain('actual_thumb_nail');
    }
  );

  it(
    'uses StaticThumbnailView when model does not offer thumbnailFile function',
    () => {
      var view = new ModelThumbnailView({
        model: f.theme({preview_thumbnail_url: 'file_for_use_on_thumb_nails.jpeg'})
      });

      view.render();
      var staticThumbnail = StaticThumbnail.find(view);

      expect(staticThumbnail.backgroundImage()).toContain('file_for_use_on_thumb_nails');
    }
  );
});
