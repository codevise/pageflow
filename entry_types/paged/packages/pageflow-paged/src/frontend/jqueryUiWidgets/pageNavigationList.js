import jQuery from 'jquery';
import {PageNavigationListAnimation} from './PageNavigationListAnimation';
import {ChapterFilter} from '../ChapterFilter';
import {HighlightedPage} from '../HighlightedPage';
import {ready} from '../ready';
import {state} from '../state';

(function($) {
  $.widget('pageflow.pageNavigationList', {
    _create: function() {
      var element = this.element;
      var options = this.options;
      var scroller = options.scroller;
      var links = element.find('a[href]');

      var chapterFilter = ChapterFilter.create();
      var highlightedPage = HighlightedPage.create(options.highlightedPage);
      var animation = PageNavigationListAnimation.create();

      ready.then(function() {
        highlightUnvisitedPages(state.visited.getUnvisitedPages());
        update(getPagePermaId(state.slides.currentPage()));
      });

      state.slides.on('pageactivate', function(e) {
        setPageVisited(e.target.getAttribute('id'));
        update(getPagePermaId(e.target));
      });

      function getPagePermaId(section) {
        return parseInt($(section).attr('id') || $(section).attr('data-perma-id'), 10);
      }

      function update(currentPagePermaId) {
        var highlightedPagePermaId = highlightedPage.getPagePermaId(currentPagePermaId);
        var highlightedChapterId = state.entryData.getChapterIdByPagePermaId(highlightedPagePermaId);

        element.toggleClass('inside_sub_chapter', highlightedPagePermaId !== currentPagePermaId);

        filterChapters(currentPagePermaId).then(function() {
          highlightPage(highlightedPagePermaId, {animate: !animation.enabled});
          highlightChapter(highlightedChapterId);

          if (options.onFilterChange) {
            options.onFilterChange();
          }
        });
      }

      function highlightPage(permaId, highlightOptions) {
        links.each(function() {
          var link = $(this);
          var active = '#' + permaId === link.attr('href');

          link.toggleClass('active', active);
          link.attr('tabindex', active ? '-1' : '3');

          if (active) {
            if (options.scrollToActive) {
              var target = options.scrollToActive === true ?
                link :
                link.parents(options.scrollToActive);

              scroller.scrollToElement(target[0], highlightOptions.animate ? 800 : 0);
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
        animation.update(currentPagePermaId);

        links.each(function() {
          var link = $(this);
          animation.start(link.parent(), visible(currentPagePermaId, link));
        });

        return $.when(animation.enabled && animationDurationElapsed()).then(function() {
          links.each(function() {
            var link = $(this);
            var pageIsVisible = visible(currentPagePermaId, link);

            animation.finish(link.parent(), pageIsVisible);
            link.parent().andSelf().toggleClass('filtered', !pageIsVisible);

            if (pageIsVisible && options.lazyLoadImages) {
              link.loadLazyImages();
            }
          });

          scroller.refresh();
        });
      }

      function visible(currentPagePermaId, link) {
        return chapterFilter.chapterVisibleFromPage(
          currentPagePermaId,
          link.data('chapterId')
        );
      }

      function animationDurationElapsed() {
        if (options.animationDuration) {
          if (options.onAnimationStart) {
            options.onAnimationStart();
          }

          return $.Deferred(function(deferred) {
            setTimeout(function() {
              deferred.resolve();

              if (options.onAnimationEnd) {
                setTimeout(options.onAnimationEnd, 500);
              }
            }, 500);
          }).promise();
        }
      }
    }
  });
}(jQuery));
