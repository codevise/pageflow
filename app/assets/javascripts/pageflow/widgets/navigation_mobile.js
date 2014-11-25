/*global IScroll*/

(function($) {
  $.widget('pageflow.navigationMobile', {
    _create: function() {
      /* mobile version */
      var element = this.element,
          scroller;

      var goToPage = function (event) {
        var a = $('a', this),
          id = a.attr("data-link"),
          share = a.data("share-page");

        if (id !== undefined) {
          pageflow.slides.goToById(id);
          $('.navigation_mobile').removeClass('active');
        }
        else if (share === undefined) {
          window.open(a.attr('href'), '_blank');
          event.preventDefault();
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

      $('.sharing_mobile', this.element).shareMenu({
        clickTarget: $('.sharing_mobile li', this.element),
        subMenu: $('.sub_share', this.element),
        links: $('.sharing_mobile li > a', this.element)
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
          $('li', element).removeClass('touched').off('touchend mouseup MSPointerUp', goToPage);
        });

        $('.menu', element).click(function() {
          scroller.refresh();
        });

        if (!$(element).data('touchBound')) {
          $('li', element).on({
            'touchstart mousedown MSPointerDown': function() {
              $(this).addClass('touched');
              $(this).one('touchend mouseup MSPointerUp', goToPage);
            },
            'touchend mouseup MSPointerUp': function() {
              $(this).removeClass('touched');
            }
          });
          $(element).data('touchBound', true);
        }

      });
    }
  });
}(jQuery));
