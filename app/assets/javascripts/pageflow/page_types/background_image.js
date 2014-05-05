pageflow.pageType.register('background_image', _.extend({

  prepareNextPageTimeout: 0,

  enhance: function(pageElement, configuration) {},

  prepare: function(pageElement, configuration) {
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {},

  activated: function(pageElement, configuration) {},

  deactivating: function(pageElement, configuration) {},

  deactivated: function(pageElement, configuration) {},

  update: function(pageElement, configuration) {

    pageElement.find('h2 .tagline').text(configuration.get('tagline') || '');
    pageElement.find('h2 .title').text(configuration.get('title') || '');
    pageElement.find('h2 .subtitle').text(configuration.get('subtitle') || '');
    pageElement.find('p').html(configuration.get('text') || '');

    this.updateCommonPageCssClasses(pageElement, configuration);

    pageElement.find('.shadow').css({
      opacity: configuration.get('gradient_opacity') / 100
    });
  },

  embeddedEditorViews: function() {
    return {
      '.background_image': {
        view: pageflow.BackgroundImageEmbeddedView,
        options: {propertyName: 'background_image_id'}
      }
    };
  }
}, pageflow.commonPageCssClasses));