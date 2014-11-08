pageflow.BackgroundPositioningView = Backbone.Marionette.ItemView.extend({
  template: 'templates/background_positioning',
  className: 'background_positioning dialog',

  mixins: [pageflow.dialogView],

  ui: {
    screenList: 'ul.screens',
    container: '.container',

    maskLeft: '.mask.left',
    maskRight: '.mask.right',
    maskTop: '.mask.top',
    maskBottom: '.mask.bottom',

    sliderHorizontal: '.horizontal.slider',
    sliderVertical: '.vertical.slider'
  },

  screenRatios: {
    ratio16to9: 16 / 9,
    ratio4to3: 4 / 3
  },

  events: {
    'click .save': function() {
      this.save();
      this.close();
    }
  },

  initialize: function() {
    this.currentScreen = _.keys(this.screenRatios)[0];
  },

  onRender: function() {
    var file = this.model.getReference(this.options.propertyName, this.options.filesCollection),
        image = $('<img />').attr('src', file.getBackgroundPositioningImageUrl());
    this.ui.container.append(image);

    var view = this;

    this.ui.sliderVertical.slider({
      orientation: 'vertical',
      value: 100 - this.model.getFilePosition(this.options.propertyName, 'y'),

      slide: function(event, ui) {
        view.updateMaskPosition({y: 100 - ui.value});
      },

      start: function() {
        view.ui.maskLeft.hide();
        view.ui.maskRight.hide();
      },

      stop: function() {
        view.ui.maskLeft.show();
        view.ui.maskRight.show();
      }
    });

    this.ui.sliderHorizontal.slider({
      orientation: 'horizontal',
      value: this.model.getFilePosition(this.options.propertyName, 'x'),

      slide: function(event, ui) {
        view.updateMaskPosition({x: ui.value});
      },

      start: function() {
        view.ui.maskTop.hide();
        view.ui.maskBottom.hide();
      },

      stop: function() {
        view.ui.maskTop.show();
        view.ui.maskBottom.show();
      }
    });

    this.updateScreens();
  },

  onShow: function() {
    this.updateMaskSize();
  },

  save: function() {
    this.model.setFilePosition(this.options.propertyName, 'x', this.ui.sliderHorizontal.slider('value'));
    this.model.setFilePosition(this.options.propertyName, 'y', 100 - this.ui.sliderVertical.slider('value'));
  },

  updateScreens: function() {
    var view = this;

    _.each(_.keys(this.screenRatios), function(name) {
      var item = $('<li><a href=""></a></li>');
      item.find('a').text(I18n.t('editor.screens.' + name));

      item.on('click', function() {
        view.ui.screenList.find('li').removeClass('active');
        $(this).addClass('active');

        view.currentScreen = name;
        view.updateMaskSize();
      });

      view.ui.screenList.append(item);
    });

    view.ui.screenList.find('li').first().addClass('active');
  },

  updateMaskPosition: function(options) {
    options = options || {};
    var x = 'x' in options ? options.x : this.ui.sliderHorizontal.slider('value');
    var y = 'y' in options ? options.y : 100 - this.ui.sliderVertical.slider('value');

    this.ui.maskLeft.width((this.ui.container.width() - this.maskWidth()) * x / 100);
    this.ui.maskRight.width((this.ui.container.width() - this.maskWidth()) * (1 - x / 100));
    this.ui.maskTop.height((this.ui.container.height() - this.maskHeight()) * y / 100);
    this.ui.maskBottom.height((this.ui.container.height() - this.maskHeight()) * (1 - y / 100));
  },

  updateMaskSize: function() {
    this.ui.sliderHorizontal.css({
      left: this.maskWidth() / 2,
      right: this.maskWidth() / 2
    });

    this.ui.sliderVertical.css({
      top: this.maskHeight() / 2,
      bottom: this.maskHeight() / 2
    });

    this.updateMaskPosition();
  },

  maskWidth: function() {
    return this.ui.container.height() / this.maskRatio();
  },

  maskHeight: function() {
    return this.ui.container.width() / this.maskRatio();
  },

  maskRatio: function() {
    return this.screenRatios[this.currentScreen];
  }
});

pageflow.BackgroundPositioningView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.BackgroundPositioningView(options).render());
};