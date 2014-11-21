pageflow.BackgroundPositioningSlidersView = Backbone.Marionette.ItemView.extend({
  template: 'templates/background_positioning_sliders',
  className: '',

  ui: {
    container: '.container',

    sliderHorizontal: '.horizontal.slider',
    sliderVertical: '.vertical.slider'
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

  onRender: function() {
    var view = this;
    var file = this.model.getReference(this.options.propertyName, this.options.filesCollection),
        image = $('<img />').attr('src', file.getBackgroundPositioningImageUrl());

    this.ui.container.append(image);

    this.ui.sliderVertical.slider({
      orientation: 'vertical',
      step: 0.01,
      value: 100 - this.model.getFilePosition(this.options.propertyName, 'y'),

      change: function() {
        view.save();
      },

      slide: function(event, ui) {
        view.save({y: ui.value});
      }
    });

    this.ui.sliderHorizontal.slider({
      orientation: 'horizontal',
      step: 0.01,
      value: this.model.getFilePosition(this.options.propertyName, 'x'),

      change: function() {
        view.save();
      },

      slide: function(event, ui) {
        view.save({y: ui.value});
      }
    });
  },

  onShow: function() {
  },

  saveFromEvent: function(event) {
    var x = event.pageX - this.ui.container.offset().left;
    var y = event.pageY - this.ui.container.offset().top;

    this.ui.sliderHorizontal.slider('value', x / this.ui.container.width() * 100);
    this.ui.sliderVertical.slider('value', (1 - y / this.ui.container.height()) * 100);
    this.save();
  },

  save: function(options) {
    options = options || {};

    var x = x in options ? options.x : this.ui.sliderHorizontal.slider('value');
    var y = y in options ? options.y : 100 - this.ui.sliderVertical.slider('value');

    this.model.setFilePosition(this.options.propertyName, 'x', x);
    this.model.setFilePosition(this.options.propertyName, 'y', y);
  }
});
