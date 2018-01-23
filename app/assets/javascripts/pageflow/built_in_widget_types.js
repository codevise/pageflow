pageflow.widgetTypes.register('default_navigation', {
  enhance: function(element) {
    element.navigation();
  }
});

pageflow.widgetTypes.register('default_mobile_navigation', {
  enhance: function(element) {
    element.navigationMobile();
  }
});

pageflow.widgetTypes.register('default_mute_toogle', {
  enhance: function(element) {
    element.muteToggle();
  }
});