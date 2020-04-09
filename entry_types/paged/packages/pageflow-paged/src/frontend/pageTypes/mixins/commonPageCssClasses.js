import $ from 'jquery';
import _ from 'underscore';
import {state} from '../../state';

export const commonPageCssClasses = {
  updateCommonPageCssClasses: function(pageElement, configuration) {
    pageElement.toggleClass('invert', configuration.get('invert'));
    pageElement.toggleClass('hide_title', configuration.get('hide_title'));
    pageElement.toggleClass('hide_logo', !!configuration.get('hide_logo'));

    toggleModeClass(state.Page.textPositions, 'text_position');
    toggleModeClass(state.Page.delayedTextFadeIn, 'delayed_text_fade_in');
    toggleModeClass(state.Page.scrollIndicatorModes, 'scroll_indicator_mode');
    toggleModeClass(state.Page.scrollIndicatorOrientations, 'scroll_indicator_orientation');

    function toggleModeClass(modes, name) {
      var value = configuration.get(name);

      _.each(modes, function(mode) {
        pageElement.removeClass(name + '_' + mode);
      });

      if (value) {
        pageElement.addClass(name + '_' + value);
      }
    }

    pageElement.toggleClass('no_text_content', !hasContent());

    function hasContent() {
      var hasTitle = _(['title','subtitle','tagline']).some(function(attribute) {
        return !!$.trim(configuration.get(attribute));
      });

      var text = $('<div />').html(configuration.get('text')).text();
      var hasText = !!$.trim(text);

      return (hasTitle && !configuration.get('hide_title')) || hasText;
    }
  }
};