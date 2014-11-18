(function($) {
  $.widget('pageflow.pageNavigationList', {
    _create: function() {
      var element = this.element;
      var options = this.options;
      var scroller = options.scroller;
      var links = element.find('a');
      var visited = new pageflow.Visited(links);

      pageflow.ready.then(function() {
        highlightUnvisitedPages(visited.getUnvisitedPages());
        highlightActivePage(getPageId(pageflow.slides.currentPage()));
      });

      pageflow.slides.on('pageactivate', function(e) {
        setPageVisited(e.target.getAttribute('id'));
        highlightActivePage(getPageId(e.target));
      });

      function getPageId(section) {
        return $(section).attr('id') || ($(section).data('permaId') || '').toString();
      }

      function highlightActivePage(id) {
        var displayPageId = _.find(pageIdsUpUntil(id).reverse(), function(id) {
          return links.filter('[href="#' + id + '"]').length;
        });

        highlightPage(displayPageId);
      }

      function highlightPage(id) {
        links.each(function() {
          var link = $(this);
          var active = '#' + id === link.attr('href');

          link.toggleClass('active', active);
          link.attr('tabindex', active ? '-1' : '3');

          if (options.scrollToActive && active) {
            scroller.scrollToElement(link[0], 800);
          }
        });
      }

      function pageIdsUpUntil(id) {
        var found = false;

        return _.filter(pageIds(), function(other) {
          var result = !found;
          found = found || (id === other);
          return result;
        });
      }

      function pageIds() {
        if (_.isArray(pageflow.pages)) {
          return _.map(pageflow.pages, function(page) {
            return page.perma_id.toString();
          });
        }
        else {
          return pageflow.pages.map(function(page) {
            return page.get('perma_id').toString();
          });
        }
      }

      function highlightUnvisitedPages(ids) {
        links.each(function() {
          var link = $(this);
          var unvisited = ids.indexOf(link.attr('href').substr(1)) >= 0;

          link.toggleClass('unvisited', unvisited);
        });
      }

      function setPageVisited(id) {
        visited.setPageVisited(id);
        element.find('[href="#' + id + '"]').removeClass('unvisited');
      }
    }
  });
}(jQuery));