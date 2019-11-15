pageflow.tooltipContainer = {
  events: {
    'mouseover [data-tooltip]': function(event) {
      if (!this.tooltip.visible) {
        var target = $(event.target);
        var key = target.data('tooltip');
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

    'mouseout [data-tooltip]': function() {
      this.tooltip.hide();
    }
  },

  onRender: function() {
    this.appendSubview(this.tooltip = new pageflow.TooltipView());
  }
};