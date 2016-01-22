pageflow.ScrollIndicator = pageflow.Object.extend({
  initialize: function(pageElement) {
    this.pageElement = pageElement;
  },

  disable: function() {
    if (this._isPageActive()) {
      pageflow.events.trigger('scroll_indicator:disable');
    }
  },

  scheduleDisable: function() {
    if (this._isPageActive()) {
      pageflow.events.trigger('scroll_indicator:schedule_disable');
    }
  },

  enable: function(text) {
    if (this._isPageActive()) {
      pageflow.events.trigger('scroll_indicator:enable');
    }
  },

  _isPageActive: function() {
    return this.pageElement.hasClass('active');
  }
});