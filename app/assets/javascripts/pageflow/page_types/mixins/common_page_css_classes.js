pageflow.commonPageCssClasses = {
  updateCommonPageCssClasses: function(pageElement, configuration) {
    pageElement.toggleClass('invert', configuration.get('invert'));
    pageElement.toggleClass('hide_title', configuration.get('hide_title'));

    toggleModeClass(pageflow.Page.textPositions, 'text_position');
    toggleModeClass(pageflow.Page.delayedTextFadeIn, 'delayed_text_fade_in');
    toggleModeClass(pageflow.Page.scrollIndicatorModes, 'scroll_indicator_mode');
    toggleModeClass(pageflow.Page.scrollIndicatorOrientations, 'scroll_indicator_orientation');

    function toggleModeClass(modes, name) {
      var value = configuration.get(name);

      _.each(modes, function(mode) {
        pageElement.removeClass(name + '_' + mode);
      });

      if (value) {
        pageElement.addClass(name + '_' + value);
      }
    }
  }
};