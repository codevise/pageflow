describe('ModelThumbnailView', function() {
  var f = support.factories;

  it('uses FileThumbnailView when model offers thumbnailFile function',
     function() {
       var view = new pageflow.ModelThumbnailView({
         model: f.file({thumbnail_url: 'picture_of_an_actual_thumb_nail.gif'})
       });

       view.render();
       var fileThumbnailView = support.dom.FileThumbnailView.find(view);

       expect(fileThumbnailView.backgroundImage()).to.contain('actual_thumb_nail');
     }
    );

  it('uses StaticThumbnailView when model does not offer thumbnailFile function',
     function() {
       var view = new pageflow.ModelThumbnailView({
         model: f.theme({preview_thumbnail_url: 'file_for_use_on_thumb_nails.jpeg'})
       });

       view.render();
       var staticThumbnailView = support.dom.StaticThumbnailView.find(view);

       expect(staticThumbnailView.backgroundImage())
         .to.contain('file_for_use_on_thumb_nails');
     }
    );
});
