(function($) {
  $.widget('pageflow.pageNavigationList', {
    _create: function() {
      var element = this.element;
      var options = this.options;
      var scroller = options.scroller;
      var links = element.find('a[href]');

      var chapterFilter = pageflow.ChapterFilter.create();
      var highlightedPage = pageflow.HighlightedPage.create();

      pageflow.ready.then(function() {
        highlightUnvisitedPages(pageflow.visited.getUnvisitedPages());
        update(getPagePermaId(pageflow.slides.currentPage()));
      });

      pageflow.slides.on('pageactivate', function(e) {
        setPageVisited(e.target.getAttribute('id'));
        update(getPagePermaId(e.target));
      });

      function getPagePermaId(section) {
        return parseInt($(section).attr('id') || $(section).attr('data-perma-id'), 10);
      }

      function update(currentPagePermaId) {
        var highlightedPagePermaId = highlightedPage.getPagePermaId(currentPagePermaId);
        var highlightedChapterId = pageflow.entryData.getChapterIdByPagePermaId(highlightedPagePermaId);

        element.toggleClass('inside_sub_chapter', highlightedPagePermaId !== currentPagePermaId);

        highlightPage(highlightedPagePermaId);
        highlightChapter(highlightedChapterId);
        filterChapters(currentPagePermaId);
      }

      function highlightPage(permaId) {
        links.each(function() {
          var link = $(this);
          var active = '#' + permaId === link.attr('href');

          link.toggleClass('active', active);
          link.attr('tabindex', active ? '-1' : '3');

          if (active) {
            if (options.scrollToActive) {
              scroller.scrollToElement(link[0], 800);
            }
          }
        });
      }

      function highlightChapter(activeChapterId) {
        links.each(function() {
          var link = $(this);
          var active = activeChapterId === link.data('chapterId');

          link.toggleClass('in_active_chapter', active);
        });
      }

      function highlightUnvisitedPages(ids) {
        links.each(function() {
          var link = $(this);
          var unvisited = ids.indexOf(parseInt(link.attr('href').substr(1), 10)) >= 0;

          link.toggleClass('unvisited', unvisited);
        });
      }

      function setPageVisited(id) {
        element.find('[href="#' + id + '"]').removeClass('unvisited');
      }

      function filterChapters(currentPagePermaId) {
        links.each(function() {
          var link = $(this);

          link.toggleClass('filtered', !chapterFilter.chapterVisibleFromPage(
            currentPagePermaId,
            link.data('chapterId')
          ));
        });

        scroller.refresh();
      }
    }
  });
}(jQuery));