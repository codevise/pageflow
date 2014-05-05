pageflow.commonPageCssClasses = {
  updateCommonPageCssClasses: function(pageElement, configuration) {
    pageElement.toggleClass('invert', configuration.get('invert'));
    pageElement.toggleClass('hide_title', configuration.get('hide_title'));

    _.each(pageflow.Page.textPositions, function(position) {
      pageElement.removeClass('text_position_' + position);
    });
    pageElement.addClass('text_position_' + configuration.get('text_position'));
  }
};