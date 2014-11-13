/*global pageflow, IScroll, jQuery*/

jQuery(function($) {
  $.widget('pageflow.overview', {
    _create: function() {
      var that = this,
        scroller,
        chapterParts = $('.ov_chapter', this.element),
        pages = $('.ov_page', this.element),
        noOfChapterParts = chapterParts.size(),
        scrollerWidth = noOfChapterParts * chapterParts.outerWidth(true),
        closeButton = $('.close', this.element),
        indexButton = $('.navigation_index'),
        homeButton = $('.navigation_home'),
        overview = $('.overview'),
        wrapper = $('.wrapper', this.element);

      var toggleContent = function(state) {
        var scrollIndicator = $('.slideshow .scroll_indicator');

        overview.toggleClass('active', state);
        indexButton
          .toggleClass('active', state)
          .updateTitle();

        $('.page .content').toggleClass('hidden', state);
        scrollIndicator.toggleClass('hidden', state);
      };

      var goToPage = function() {
        if (!$(this).hasClass('active')) {
          toggleContent();
          pageflow.slides.goToById(this.getAttribute("data-link"));
        }
      };

      $('.scroller', this.element).width(scrollerWidth);

      if (wrapper.find('.ov_chapter').length) {
        // scroller throws exception if initialized with empty set
        // of pages

        scroller = new IScroll(wrapper[0], {
          snap: '.ov_chapter',
          bounce: false,
          scrollX: true,
          scrollY: false,
          probeType: 2,
          mouseWheel: true,
          preventDefault: false
        });

        scroller.on('scroll', function() {
          pages.removeClass('touched').off('touchend mouseup', goToPage);
        });

        wrapper.pageNavigationList({
          scroller: scroller
        });

        this.element.find('.scroll_indicator.left').scrollButton({
          scroller: scroller,
          page: true,
          direction: 'left'
        });

        this.element.find('.scroll_indicator.right').scrollButton({
          scroller: scroller,
          page: true,
          direction: 'right'
        });
      }

      pages.each(function() {
        $(this).on({
          'touchstart mousedown': function() {
            $(this).addClass('touched');
            $(this).one('touchend mouseup', goToPage);
          },
          'touchend mouseup': function() {
            $(this).removeClass('touched');
          },
          'click': function(event) {
            event.preventDefault();
          }
        });
      });

      if (scrollerWidth < wrapper.width()) {
        var closeButtonLeft = Math.max(400, scrollerWidth - closeButton.width() - 10);

        closeButton.css({
          left: closeButtonLeft + 'px',
          right: 'auto'
        });
      }

      closeButton.click(toggleContent);
      indexButton.click(toggleContent);

      homeButton.click(function() {
        toggleContent(false);
      });

      $('body').keyup(function(e) {
        if (e.which == 27 && overview.hasClass('active')) {
          toggleContent();
        }
      });
    }
  });
});