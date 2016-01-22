pageflow.widgets = {
  isPresent: function(name) {
    return !!$('div.widget_' + name + '_present').length;
  },

  areLoaded: function() {
    return !!$('div.widgets_present').length;
  }
};