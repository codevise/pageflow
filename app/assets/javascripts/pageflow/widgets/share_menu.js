(function($) {
  $.widget('pageflow.shareMenu', {
    _create: function() {
      var $element = this.element,
          options = this.options,
          $links = options.links || $('a', $element),
          $clickTarget = options.clickTarget || $element,
          $subMenu = options.subMenu || $($element.find('.sub_share')),
          $subLinks = $('a', $subMenu),
          $closeOnMouseLeaving = options.closeOnMouseLeaving,
          scroller = options.scrollerToRefresh;

      console.log('scroller:' + options.scrollerToRefresh);

      $clickTarget.on('touchend click', function(event) {
        var $this = $(this),
            $a = $this.find('a').length ? $this.find('a') : $this,
            active = $a.hasClass('active');

        $links.removeClass('active');
        $a.addClass('active');

        if ($a.data('share-page')) {
          event.preventDefault();
          console.log('should refresh');
          console.log('bulgur', this);
          var $currentPage = pageflow.slides.currentPage(),
              id = $currentPage.attr('id') || $currentPage.data('perma-id'),
              siteShareUrl = $a.data('share-page').replace(/permaId$/, id),
              $insertAfter = options.insertAfter || $a;

          $($subLinks[0]).attr('href', $a.attr('href'));
          $($subLinks[1]).attr('href', siteShareUrl);

          if(!$insertAfter.next().hasClass('sub_share')) {
            $insertAfter.after($subMenu);
          }
          if(scroller) {
            console.log('refresh');
            scroller.refresh();
          }

          if (active) {
            $subMenu.toggle();
            $a.toggleClass('active');
          }
          else {
            $subMenu.show();
          }
        }
      });

      if(!!$closeOnMouseLeaving) {
        $closeOnMouseLeaving.on('mouseleave', function() {
          $links.removeClass('active');
          $subMenu.hide();
        });
      }
    }
  });
}(jQuery));
