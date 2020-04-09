import jQuery from 'jquery';
import {state} from '../state';

(function($) {
  $.widget('pageflow.parentPageButton', {
    _create: function() {
      var element = this.element;
      var options = this.options;

      element.click(function(event) {
        state.slides.goToParentPage();
        event.preventDefault();
      });

      state.slides.on('pageactivate', function(e, ui) {
        update();
      });

      update();

      function update() {
        var pagePermaId = parseInt(state.slides.currentPage().attr('id'), 10);
        var chapterId = state.entryData.getChapterIdByPagePermaId(pagePermaId);
        var chapterConfiguration = state.entryData.getChapterConfiguration(chapterId);
        var visible = state.slides.parentPageExists() &&
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
