/*global IScroll*/

(function($) {
  $.widget('pageflow.navigationMobile', {
    _create: function() {

      var that = this,
          element = this.element,
          scroller;

      $('body').on('touchstart mousedown MSPointerDown pointerdown', function(event) {
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

      $('.wrapper', element).each(function() {
        var sharingMobile = $(this).parents('.sharing_mobile');

        scroller = new IScroll(this, {
          mouseWheel: true,
          bounce: false,
          probeType: 3
        });

        $('ul', element).pageNavigationList({
          scroller: scroller
        });

        scroller.on('scroll', function() {
          $('.overview_mobile li', element).removeClass('touched').off('touchend mouseup MSPointerUp pointerup', that._goToPage);
          $('.sub_share a', sharingMobile).off('touchend mouseup MSPointerUp pointerup', that._openLink);
        });

        $('.menu', element).click(function() {
          scroller.refresh();
        });

        if (!$(element).data('touchBound')) {
          $('li', element).on({
            'touchstart mousedown MSPointerDown pointerdown': function() {
              $(this).addClass('touched');
            },
            'touchend mouseup MSPointerUp pointerup': function() {
              $(this).removeClass('touched');
            }
          });
          $('.overview_mobile li', element).on({
            'touchstart mousedown MSPointerDown pointerdown': function() {
              $(this).one('touchend mouseup MSPointerUp pointerup', that._goToPage);
            }
          });
          $(element).data('touchBound', true);
        }

        $('.sub_share a', sharingMobile).on({
          'touchstart mousedown MSPointerDown pointerdown': function() {
            $(this).one('touchend mouseup MSPointerUp pointerup', that._openLink);
          }
        });

        sharingMobile.shareMenu({
          subMenu: $('.sub_share', element),
          links: $('li > a', sharingMobile),
          scroller: scroller
        });
      });
    },

    _goToPage: function () {
      var a = $('a', this),
          id = a.attr("data-link");

      if (id !== undefined) {
        pageflow.slides.goToById(id);
        $('.navigation_mobile').removeClass('active');
      }
    },

    _openLink: function(event) {
      event.preventDefault();
      window.open(this.href, '_blank');
    }
  });
}(jQuery));
