pageflow.links = {
  setup: function() {
    this.preventFocusRectOnClick();
    this.ensureClickOnEnterKeyPress();
    this.setupContentSkipLinks();
    this.ensureTargetBlankForContentLinks();
  },

  preventFocusRectOnClick: function() {
    $('body').on('click mousedown', 'a, [tabindex]', function() {
      $(this).blur();
    });
  },

  ensureClickOnEnterKeyPress: function() {
    $('body').on('keypress', 'a, [tabindex]', function(e) {
      if (e.which == 13) {
        $(this).click();
      }
    });

    $('body').on('keyup', 'a, [tabindex]', function (e) {
      e.stopPropagation();
    });
  },

  setupContentSkipLinks: function() {
    $('.content_link').attr('href', '#firstContent');

    $('.content_link').click(function(e) {
      $('#firstContent').focus();
      e.preventDefault();
      return false;
    });
  },

  // There was a time when the rich text editor did not add target
  // attributes to inline links even though it should have.
  ensureTargetBlankForContentLinks: function(context) {
    $('.contentText p a', context).attr('target', '_blank');
  }
};