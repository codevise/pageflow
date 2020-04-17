import {widgetTypes} from './widgetTypes';

widgetTypes.register('default_navigation', {
  enhance: function(element) {
    element.navigation();
  }
});

widgetTypes.register('default_mobile_navigation', {
  enhance: function(element) {
    element.navigationMobile();
  }
});