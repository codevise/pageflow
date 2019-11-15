import $ from 'jquery';
import Marionette from 'backbone.marionette';

import template from '../templates/backgroundPositioningSliders.jst';

export const BackgroundPositioningSlidersView = Marionette.ItemView.extend({
  template,
  className: '',

  ui: {
    container: '.container',

    sliderHorizontal: '.horizontal.slider',
    sliderVertical: '.vertical.slider',

    inputHorizontal: '.percent.horizontal input',
    inputVertical: '.percent.vertical input'
  },

  events: {
    'mousedown img': function(event) {
      var view = this;
      view.saveFromEvent(event);

      function onMove(event) {
        view.saveFromEvent(event);
      }

      function onUp() {
        $('.background_positioning.dialog')
          .off('mousemove', onMove)
          .off('mouseup', onUp);
      }

      $('.background_positioning.dialog')
        .on('mousemove', onMove)
        .on('mouseup', onUp);
    },

    'dragstart img': function(event) {
      event.preventDefault();
    }
  },

  modelEvents: {
    change: 'update'
  },

  onRender: function() {
    var view = this;
    var file = this.model.getReference(this.options.propertyName, this.options.filesCollection),
        image = $('<img />').attr('src', file.getBackgroundPositioningImageUrl());

    this.ui.container.append(image);

    this.ui.sliderVertical.slider({
      orientation: 'vertical',

      change: function(event, ui) {
        view.save('y', 100 - ui.value);
      },

      slide: function(event, ui) {
        view.save('y', 100 - ui.value);
      }
    });

    this.ui.sliderHorizontal.slider({
      orientation: 'horizontal',

      change: function(event, ui) {
        view.save('x', ui.value);
      },

      slide: function(event, ui) {
        view.save('x', ui.value);
      }
    });

    this.ui.inputVertical.on('change', function() {
      view.save('y', $(this).val());
    });

    this.ui.inputHorizontal.on('change', function() {
      view.save('x', $(this).val());
    });

    this.update();
  },

  update: function() {
    var x = this.model.getFilePosition(this.options.propertyName, 'x');
    var y = this.model.getFilePosition(this.options.propertyName, 'y');

    this.ui.sliderVertical.slider('value', 100 - y);
    this.ui.sliderHorizontal.slider('value', x);

    this.ui.inputVertical.val(y);
    this.ui.inputHorizontal.val(x);
  },

  saveFromEvent: function(event) {
    var x = event.pageX - this.ui.container.offset().left;
    var y = event.pageY - this.ui.container.offset().top;

    this.save('x', Math.round(x / this.ui.container.width() * 100));
    this.save('y', Math.round(y / this.ui.container.width() * 100));
  },

  save: function(coord, value) {
    this.model.setFilePosition(this.options.propertyName, coord, Math.min(100, Math.max(0, value)));
  }
});
