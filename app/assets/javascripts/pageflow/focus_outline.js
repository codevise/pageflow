(function() {
  var KEY_TAB = 9;

  pageflow.FocusOutline = pageflow.Object.extend({
    initialize: function(element) {
      this.element = element;
    },

    showOnlyAfterKeyboardInteraction: function() {
      var focusOutline = this;

      this.disable();

      this.element.on('keydown', function(event) {
        if (event.which === KEY_TAB) {
          focusOutline.enable();
        }
      });

      this.element.on('mousedown', function() {
        focusOutline.disable();
      });
    },

    disable: function() {
      if (!this.disabled) {
        this.disabled = true;
        this.element.addClass('disable_focus_outline');
        this.element.removeClass('enable_focus_outline');
      }
    },

    enable: function() {
      if (this.disabled) {
        this.disabled = false;
        this.element.removeClass('disable_focus_outline');
        this.element.addClass('enable_focus_outline');
      }
    }
  });

  pageflow.FocusOutline.setup = function(element) {
    pageflow.focusOutline = new pageflow.FocusOutline(element);
    pageflow.focusOutline.showOnlyAfterKeyboardInteraction();
  };
})();