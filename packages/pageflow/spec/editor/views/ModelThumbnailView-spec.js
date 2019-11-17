describe('ModelThumbnailView', () => {
  var f = support.factories;

  test(
    'uses FileThumbnailView when model offers thumbnailFile function',
    () => {
      var view = new pageflow.ModelThumbnailView({
        model: f.file({thumbnail_url: 'picture_of_an_actual_thumb_nail.gif'})
      });

      view.render();
      var fileThumbnailView = support.dom.FileThumbnailView.find(view);

      expect(fileThumbnailView.backgroundImage()).toEqual(expect.arrayContaining(['actual_thumb_nail']));
    }
  );

  test(
    'uses StaticThumbnailView when model does not offer thumbnailFile function',
    () => {
      var view = new pageflow.ModelThumbnailView({
        model: f.theme({preview_thumbnail_url: 'file_for_use_on_thumb_nails.jpeg'})
      });

      view.render();
      var staticThumbnailView = support.dom.StaticThumbnailView.find(view);

      expect(staticThumbnailView.backgroundImage()).toEqual(expect.arrayContaining(['file_for_use_on_thumb_nails']));
    }
  );
});
