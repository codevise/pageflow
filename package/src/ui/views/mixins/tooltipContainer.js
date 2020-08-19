import $ from 'jquery';
import I18n from 'i18n-js';

import {TooltipView} from '../TooltipView';

export const tooltipContainer = {
  events: {
    'mouseover [data-tooltip]': function(event) {
      if (!this.tooltip.visible) {
        var target = $(event.currentTarget);
        var key = target.attr('data-tooltip');
        var position;

        if (target.data('tooltipAlign') === 'bottom left') {
          position = {
            left: target.position().left,
            top: target.position().top + target.outerHeight()
          };
        }
        else if (target.data('tooltipAlign') === 'bottom right') {
          position = {
            left: target.position().left + target.outerWidth(),
            top: target.position().top + target.outerHeight()
          };
        }
        else if (target.data('tooltipAlign') === 'top center') {
          position = {
            left: target.position().left + target.outerWidth() / 2,
            top: target.position().top + 2
          };
        }
        else {
          position = {
            left: target.position().left + target.outerWidth(),
            top: target.position().top + target.outerHeight() / 2
          };
        }

        this.tooltip.show(I18n.t(key), position, {
          align: target.data('tooltipAlign')
        })
      }
    },

    'mouseleave [data-tooltip]': function() {
      this.tooltip.hide();
    }
  },

  onRender: function() {
    this.appendSubview(this.tooltip = new TooltipView());
  }
};
