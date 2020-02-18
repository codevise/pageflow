import Marionette from 'backbone.marionette';

import template from '../templates/backButtonDecorator.jst';

import {editor} from '../base';

export const BackButtonDecoratorView = Marionette.Layout.extend({
  template,
  className: 'back_button_decorator',

  events: {
    'click a.back': 'goBack'
  },

  regions: {
    outlet: '.outlet'
  },

  onRender: function() {
    this.outlet.show(this.options.view);
  },

  goBack: function() {
    this.options.view.onGoBack && this.options.view.onGoBack();
    editor.navigate('/', {trigger: true});
  }
});
