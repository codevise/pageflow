(function($) {
  $.widget('pageflow.parentPageButton', {
    _create: function() {
      var element = this.element;
      var options = this.options;

      element.click(function(event) {
        pageflow.slides.goToParentPage();
        event.preventDefault();
      });

      pageflow.slides.on('pageactivate', function(e, ui) {
        update();
      });

      update();

      function update() {
        var pagePermaId = parseInt(pageflow.slides.currentPage().attr('id'), 10);
        var chapterId = pageflow.entryData.getChapterIdByPagePermaId(pagePermaId);
        var chapterConfiguration = pageflow.entryData.getChapterConfiguration(chapterId);
        var visible = pageflow.slides.parentPageExists() &&
          chapterConfiguration.display_parent_page_button !== false;

        if (options.visibleClass) {
          element.toggleClass(options.visibleClass, visible);
        }
        else {
          element.toggle(visible);
        }
      }
    }
  });
}(jQuery));