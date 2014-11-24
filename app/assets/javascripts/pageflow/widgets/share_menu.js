(function($) {
  $.widget('pageflow.shareMenu', {
    _create: function() {
      var $element = this.element,
          options = this.options,
          $links = options.links || $('a', $element),
          $clickTarget = options.clickTarget || $element,
          $subMenu = options.subMenu || $($element.find('.sub_share')),
          $subLinks = $('a', $subMenu);

      $clickTarget.on('touchend click', function(event) {
        var $this = $(this);

        var $a = $this.find('a').length ? $this.find('a') : $this;

        var active = $a.hasClass('active');

        $links.removeClass('active');
        $a.addClass('active');

        if ($a.data('share-page')) {
          event.preventDefault();

          var $currentPage = pageflow.slides.currentPage();
          var id = $currentPage.attr('id') || $currentPage.data('perma-id');
          var siteShareUrl = $a.data('share-page').replace(/permaId$/, id);
          var $insertAfter = options.insertAfter || $a.parent();

          $($subLinks[0]).attr('href', $a.attr('href'));
          $($subLinks[1]).attr('href', siteShareUrl);

          if(!$insertAfter.next().hasClass('sub_share')) {
            $insertAfter.after($subMenu);
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

      $element.on('mouseleave', function() {
        $links.removeClass('active');
        $subMenu.hide();
      });
    }
  });
}(jQuery));
