import jQuery from 'jquery';
import IScroll from 'iscroll';
import {events} from 'pageflow/frontend';
import {state} from '../state';

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
        overview = $('.overview'),
        wrapper = $('.wrapper', this.element);

      var toggleContent = function(state) {
        var scrollIndicator = $('.slideshow .scroll_indicator');

        overview.toggleClass('active', state);
        overview.loadLazyImages();

        indexButton
          .toggleClass('active', state)
          .updateTitle();

        $('section.page').toggleClass('hidden_by_overlay', state);
        scrollIndicator.toggleClass('hidden', state);

        if (overview.hasClass('active')) {
          events.once('page:change', function() {
            toggleContent(false);
          }, that);
        }
        else {
          events.off('page:change', null, that);
        }
      };

      var goToPage = function() {
        if (!$(this).hasClass('active')) {
          state.slides.goToById(this.getAttribute("data-link"));
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
          scroller: scroller,
          scrollToActive: '.ov_chapter'
        });

        this.element.find('.overview_scroll_indicator.left').scrollButton({
          scroller: scroller,
          page: true,
          direction: 'left'
        });

        this.element.find('.overview_scroll_indicator.right').scrollButton({
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
        var closeButtonPos = Math.max(400, scrollerWidth - closeButton.width() - 10);

        if (isDirLtr(closeButton)) {
          closeButton.css({
            left: closeButtonPos + 'px',
            right: 'auto'
          });
        }
        else {
          closeButton.css({
            right: closeButtonPos + 'px',
            left: 'auto'
          });
        }
      }

      closeButton.click(toggleContent);
      indexButton.click(toggleContent);

      $('body').keyup(function(e) {
        if (e.which == 27 && overview.hasClass('active')) {
          toggleContent();
        }
      });

      function isDirLtr(el) {
        var styles = window.getComputedStyle(el[0]);
        return styles.direction == 'ltr';
      }
    }
  });
});
