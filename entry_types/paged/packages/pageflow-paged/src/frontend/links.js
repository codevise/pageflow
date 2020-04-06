import $ from 'jquery';

export const links = {
  setup: function() {
    this.ensureClickOnEnterKeyPress();
    this.setupContentSkipLinks();
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
  }
};