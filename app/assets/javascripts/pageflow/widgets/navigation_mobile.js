/*global IScroll*/

(function($) {
  $.widget('pageflow.navigationMobile', {
    _create: function() {
      /* mobile version */
      var element = this.element,
          scroller;

      var goToPage = function (event) {
        console.log('goToPage');
        var a = $('a', this),
          id = a.attr("data-link"),
          share = a.data("share-page");

        if (id !== undefined) {
          pageflow.slides.goToById(id);
          $('.navigation_mobile').removeClass('active');
        }
      };

      $('body').on('touchstart mousedown MSPointerDown', function(event) {
        if (element.hasClass('active') && !$(event.target).parents().filter(element).length) {
          element.removeClass('active imprint sharing');
        }
      });

      $('.menu.index', element).click(function() {
        if(!$(element).hasClass('sharing') && !$(element).hasClass('imprint')) {
          $(element).toggleClass('active');
        }
        $(element).removeClass('imprint sharing');
      });
      $('.menu.sharing', element).click(function() {
        $(element).addClass('sharing');
        $(element).removeClass('imprint');
      });
      $('.menu.imprint', element).click(function() {
        $(element).addClass('imprint');
        $(element).removeClass('sharing');
      });

      $('.wrapper', this.element).each(function() {
        scroller = new IScroll(this, {
          mouseWheel: true,
          bounce: false,
          probeType: 3
        });

        $('ul', element).pageNavigationList({
          scroller: scroller
        });

        scroller.on('scroll', function() {
          $('.overview_mobile li', element).removeClass('touched').off('touchend mouseup MSPointerUp', goToPage);
        });

        $('.menu', element).click(function() {
          scroller.refresh();
        });

        if (!$(element).data('touchBound')) {
          $('li', element).on({
            'touchstart mousedown MSPointerDown': function() {
              $(this).addClass('touched');
            },
            'touchend mouseup MSPointerUp': function() {
              $(this).removeClass('touched');
            }
          });
          $('.overview_mobile li', element).on({
            'touchstart mousedown MSPointerDown': function() {
              $(this).one('touchend mouseup MSPointerUp', goToPage);
            }
          });
          $(element).data('touchBound', true);
        }

      });

      $('.sharing_mobile', this.element).shareMenu({
        clickTarget: $('.sharing_mobile li > a', this.element),
        subMenu: $('.sub_share', this.element),
        links: $('.sharing_mobile li > a', this.element),
        scrollerToRefresh: scroller
      });

    }
  });
}(jQuery));
