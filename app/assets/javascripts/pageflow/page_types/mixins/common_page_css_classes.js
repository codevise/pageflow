pageflow.commonPageCssClasses = {
  updateCommonPageCssClasses: function(pageElement, configuration) {
    pageElement.toggleClass('invert', configuration.get('invert'));
    pageElement.toggleClass('hide_title', configuration.get('hide_title'));

    _.each(pageflow.Page.textPositions, function(position) {
      pageElement.removeClass('text_position_' + position);
    });
    pageElement.addClass('text_position_' + configuration.get('text_position'));

    _.each(pageflow.Page.scrollIndicatorModes, function(mode) {
      pageElement.removeClass('scroll_indicators_' + mode);
    });

    if (configuration.get('scroll_indicator_mode')) {
      pageElement.addClass('scroll_indicators_' + configuration.get('scroll_indicator_mode'));
    }
  }
};